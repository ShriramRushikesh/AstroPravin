import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { MatrimonyUser, MatrimonyUserDocument } from '../schemas/matrimony-user.schema';
import { MatrimonyProfile, MatrimonyProfileDocument } from '../schemas/matrimony-profile.schema';
import { MatrimonyLoginDto } from './dto/login.dto';
import { MatrimonyChangePasswordDto } from './dto/change-password.dto';
import { MatrimonyRegisterDto } from './dto/register.dto';
import { MatrimonySubmitPaymentDto } from './dto/payment.dto';

@Injectable()
export class MatrimonyAuthService {
  constructor(
    @InjectModel(MatrimonyUser.name) private userModel: Model<MatrimonyUserDocument>,
    @InjectModel(MatrimonyProfile.name) private profileModel: Model<MatrimonyProfileDocument>,
    private jwtService: JwtService,
  ) {}

  getRegistrationConfig() {
    return {
      amount: 1100,
      originalAmount: 2100,
      discountPercent: 48,
      currency: 'INR',
      upiId: 'pravin.shriram@upi',
      merchantName: 'Astro Pravin Matrimony',
      accountName: 'Pandit Pravin Shriram',
      bankName: 'State Bank of India',
      benefits: [
        '100% Genuine & Pandit Verified Profiles',
        'Ashta Koota 36-Guna Kundli Matchmaking Engine',
        'Confidential Contact & Photo Privacy Protection',
        'Direct Chat & Astrological Guidance from Pandit Pravin',
        'Zero Spam, Zero Fake Accounts Guarantee',
      ],
      qrPayload: 'upi://pay?pa=pravin.shriram@upi&pn=AstroPravin%20Matrimony&am=1100&cu=INR&tn=Matrimony%20Registration',
    };
  }

  async register(registerDto: MatrimonyRegisterDto) {
    const { fullName, phone, email, password, gender, dateOfBirth, caste, subCaste, religion, currentCity, currentState, motherTongue, profileCreatedBy } = registerDto;

    // Check if phone or email is already registered
    const existingUser = await this.userModel.findOne({
      $or: [
        { phone: phone.trim() },
        ...(email ? [{ email: email.trim().toLowerCase() }] : []),
      ],
    });

    if (existingUser) {
      throw new ConflictException('An account with this phone number or email already exists. Please login instead.');
    }

    // Generate unique username: ap_firstname_rand4
    const cleanFirstName = fullName.trim().toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '') || 'member';
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    let username = `ap_${cleanFirstName}_${randSuffix}`;

    // Ensure username uniqueness
    let attempts = 0;
    while (await this.userModel.findOne({ username }) && attempts < 10) {
      username = `ap_${cleanFirstName}_${Math.floor(1000 + Math.random() * 9000)}`;
      attempts++;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new this.userModel({
      username,
      passwordHash,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      tier: 'basic',
      status: 'pending_payment',
      paymentStatus: 'unpaid',
      isSelfRegistered: true,
      isFirstLogin: false,
      membershipAmount: 1100,
      membershipMode: 'upi',
      lastLoginAt: new Date(),
    });

    await newUser.save();

    // Create Initial Profile Linked to this User
    const newProfile = new this.profileModel({
      userId: newUser._id,
      fullName: fullName.trim(),
      gender,
      dateOfBirth: new Date(dateOfBirth),
      caste: caste || '',
      subCaste: subCaste || '',
      religion: religion || 'Hindu',
      currentCity: currentCity || '',
      currentState: currentState || 'Maharashtra',
      motherTongue: motherTongue || 'Marathi',
      profileCreatedBy: profileCreatedBy || 'Self',
      isContactVisible: false,
      profileCompleteness: 25,
      photos: [],
    });

    await newProfile.save();

    const payload = {
      sub: newUser._id.toString(),
      username: newUser.username,
      tier: newUser.tier,
      type: 'matrimony',
    };

    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Account created successfully! Please complete membership fee activation to unlock full portal access.',
      token,
      user: {
        userId: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        phone: newUser.phone,
        email: newUser.email,
        tier: newUser.tier,
        status: newUser.status,
        paymentStatus: newUser.paymentStatus,
        isFirstLogin: newUser.isFirstLogin,
        isSelfRegistered: newUser.isSelfRegistered,
        membershipAmount: newUser.membershipAmount,
      },
      profile: {
        id: newProfile._id,
        fullName: newProfile.fullName,
        gender: newProfile.gender,
        completeness: newProfile.profileCompleteness || 25,
        isContactVisible: newProfile.isContactVisible,
        isProfileFeatured: newProfile.isProfileFeatured,
      },
      registrationConfig: this.getRegistrationConfig(),
    };
  }

  async submitPayment(userId: string, paymentDto: MatrimonySubmitPaymentDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { transactionId, paymentMode, amount, notes } = paymentDto || {};

      const cleanTransactionId = transactionId ? String(transactionId).trim().toUpperCase() : '';
      if (!cleanTransactionId) {
        throw new BadRequestException('Please enter a valid 12-digit UPI / UTR Transaction Reference Number.');
      }

      // Validate UTR format: Indian UPI UTR is 12 digits or alphanumeric banking ref (10-22 characters)
      const utrRegex = /^[A-Z0-9]{10,22}$/;
      if (!utrRegex.test(cleanTransactionId)) {
        throw new BadRequestException('Invalid UTR format. Bank / UPI UTR reference must be 12 digits or a valid transaction reference (10-22 alphanumeric characters).');
      }

      // Check for bogus repeated patterns like 000000000000, 111111111111, 123456789012, etc.
      const repeatedPattern = /^(.)\1{9,}$/;
      if (repeatedPattern.test(cleanTransactionId) || cleanTransactionId === '123456789012' || cleanTransactionId === '1234567890' || cleanTransactionId.toLowerCase().includes('test')) {
        throw new BadRequestException('Invalid UTR transaction reference number. Please provide the authentic 12-digit reference from your GPay, PhonePe, Paytm, or Bank app.');
      }

      // Uniqueness check: ensure this UTR hasn't already been used by another user
      const existingPaymentUser = await this.userModel.findOne({
        _id: { $ne: user._id },
        $or: [
          { 'paymentDetails.transactionId': cleanTransactionId },
          { membershipReceiptNumber: cleanTransactionId }
        ]
      });

      if (existingPaymentUser) {
        throw new BadRequestException('This Transaction / UTR reference has already been submitted by another member. If you made this payment, please contact Kendra support.');
      }

      const cleanAmount = Number(amount) || 199;
      const cleanMode = paymentMode ? String(paymentMode).trim() : 'upi';

      user.paymentDetails = {
        transactionId: cleanTransactionId,
        paymentMode: cleanMode,
        amount: cleanAmount,
        submittedAt: new Date(),
        verifiedAt: undefined, // Awaiting admin bank reconciliation
        notes: notes ? String(notes).trim() : '',
      };

      user.membershipReceiptNumber = cleanTransactionId;
      user.membershipAmount = cleanAmount;
      user.membershipMode = cleanMode;

      user.paymentStatus = 'pending_verification';
      user.status = 'pending_payment_verification';
      user.membershipPaidAt = new Date();

      user.markModified('paymentDetails');
      await user.save();

      const profile = await this.profileModel.findOne({ userId: user._id });

      return {
        success: true,
        message: 'Your UPI UTR transaction reference has been successfully submitted for bank verification.',
        user: {
          userId: user._id,
          username: user.username,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          tier: user.tier,
          status: user.status,
          paymentStatus: user.paymentStatus,
          isFirstLogin: user.isFirstLogin,
          isSelfRegistered: user.isSelfRegistered,
          membershipPaidAt: user.membershipPaidAt,
          membershipAmount: user.membershipAmount,
          paymentDetails: user.paymentDetails,
        },
        profile,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('❌ Matrimony submitPayment error:', error);
      throw new BadRequestException(error?.message || 'Failed to submit payment. Please verify transaction details.');
    }
  }

  async login(loginDto: MatrimonyLoginDto) {
    const { username, password } = loginDto;
    const cleanIdentifier = username.trim();

    // Allow login by username OR phone number
    const user = await this.userModel.findOne({
      $or: [
        { username: cleanIdentifier },
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username, phone number, or password');
    }

    if (user.status === 'suspended' || user.status === 'deleted') {
      throw new UnauthorizedException('Your matrimony account is suspended or deactivated. Contact support.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials. Please verify your password.');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const profile = await this.profileModel.findOne({ userId: user._id });

    const payload = {
      sub: user._id.toString(),
      username: user.username,
      tier: user.tier,
      type: 'matrimony',
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        tier: user.tier,
        status: user.status,
        paymentStatus: user.paymentStatus || (user.status === 'pending_payment' ? 'unpaid' : 'verified'),
        isFirstLogin: user.isFirstLogin,
        isSelfRegistered: user.isSelfRegistered,
        membershipPaidAt: user.membershipPaidAt,
        membershipAmount: user.membershipAmount,
      },
      profile: profile
        ? {
            id: profile._id,
            fullName: profile.fullName,
            gender: profile.gender,
            completeness: profile.profileCompleteness || 0,
            isContactVisible: profile.isContactVisible,
            isProfileFeatured: profile.isProfileFeatured,
          }
        : null,
      registrationConfig: this.getRegistrationConfig(),
    };
  }

  async changePassword(userId: string, changePasswordDto: MatrimonyChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.isFirstLogin = false;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully',
      isFirstLogin: false,
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const profile = await this.profileModel.findOne({ userId: user._id });

    return {
      user: {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        tier: user.tier,
        status: user.status,
        paymentStatus: user.paymentStatus || (user.status === 'pending_payment' ? 'unpaid' : 'verified'),
        isFirstLogin: user.isFirstLogin,
        isSelfRegistered: user.isSelfRegistered,
        membershipPaidAt: user.membershipPaidAt,
        membershipAmount: user.membershipAmount,
      },
      profile,
      registrationConfig: this.getRegistrationConfig(),
    };
  }
}
