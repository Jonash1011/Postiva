'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  AtSign,
  Calendar,
  FileText,
  Users,
  Phone,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Loader2,
  Camera,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { authService } from '@/services/authService';
import { authUtils } from '@/lib/auth';
import { cn, getInitials, getErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

const TOTAL_STEPS = 6;

const stepInfo = [
  { icon: AtSign, title: 'Choose a Username', subtitle: 'This will be your unique identity' },
  { icon: Calendar, title: 'Date of Birth', subtitle: 'Tell us when you were born' },
  { icon: FileText, title: 'Write Your Bio', subtitle: 'Let others know about you' },
  { icon: Users, title: 'Select Gender', subtitle: 'How do you identify?' },
  { icon: User, title: 'Profile Picture', subtitle: "We'll use your initials for now" },
  { icon: Phone, title: 'Phone Number', subtitle: 'Enter your Indian mobile number' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.25 },
  }),
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  // Form state
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // User email for initials
  const [email, setEmail] = useState('');

  useEffect(() => {
    const currentUser = authUtils.getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    if (currentUser.profileComplete) {
      router.push('/');
      return;
    }
    setEmail(currentUser.email);
  }, [router]);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 0:
        return /^[a-zA-Z0-9_]{3,30}$/.test(username);
      case 1:
        return dateOfBirth !== '';
      case 2:
        return bio.trim().length > 0;
      case 3:
        return gender !== '';
      case 4:
        return !!profileImage;
      case 5:
        return /^\+91[6-9]\d{9}$/.test('+91' + phoneNumber);
      default:
        return false;
    }
  }, [step, username, dateOfBirth, bio, gender, profileImage, phoneNumber]);

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let profileImageUrl = '';
      if (profileImage) {
        profileImageUrl = await authService.fileToBase64(profileImage);
      }

      await authService.updateProfile({
        username,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        bio,
        gender,
        profileImageUrl,
        phoneNumber: '+91' + phoneNumber,
      });
      showSuccess('Profile setup complete!');
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Something went wrong'));
      setSubmitting(false);
    }
  };

  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="e.g. john_doe"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="pl-11 h-12 text-base bg-background/80 border-border/60 focus:border-primary"
                maxLength={30}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              3-30 characters. Letters, numbers & underscores only.
            </p>
            {username && !canProceed() && (
              <p className="text-xs text-destructive">Username must be at least 3 characters.</p>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="pl-11 h-12 text-base bg-background/80 border-border/60 focus:border-primary [color-scheme:dark]"
                max={new Date().toISOString().split('T')[0]}
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <textarea
              placeholder="Tell us a little about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={cn(
                'w-full h-32 rounded-lg border border-border/60 bg-background/80 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all duration-200 resize-none'
              )}
              maxLength={300}
              autoFocus
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{bio.length}/300 characters</span>
              {!bio.trim() && (
                <span className="text-destructive">Bio is required</span>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={cn(
                  'group relative h-28 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2',
                  gender === 'male'
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border/60 bg-background/50 hover:border-primary/40 hover:bg-primary/5'
                )}
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-full flex items-center justify-center text-xl transition-all duration-300',
                    gender === 'male'
                      ? 'bg-primary/20 scale-110'
                      : 'bg-muted group-hover:bg-primary/10'
                  )}
                >
                  ♂
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    gender === 'male' ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  Male
                </span>
                {gender === 'male' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setGender('female')}
                className={cn(
                  'group relative h-28 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2',
                  gender === 'female'
                    ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/20'
                    : 'border-border/60 bg-background/50 hover:border-secondary/40 hover:bg-secondary/5'
                )}
              >
                <div
                  className={cn(
                    'h-12 w-12 rounded-full flex items-center justify-center text-xl transition-all duration-300',
                    gender === 'female'
                      ? 'bg-secondary/20 scale-110'
                      : 'bg-muted group-hover:bg-secondary/10'
                  )}
                >
                  ♀
                </div>
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    gender === 'female' ? 'text-secondary' : 'text-muted-foreground'
                  )}
                >
                  Female
                </span>
                {gender === 'female' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 h-5 w-5 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative group cursor-pointer"
              onClick={() => document.getElementById('avatar-input')?.click()}
            >
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover shadow-2xl shadow-primary/30 border-2 border-primary/20"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-primary/30">
                  {getInitials(email)}
                </div>
              )}
              <div className="absolute inset-0 h-28 w-28 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            <input
              id="avatar-input"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    showError('Image must be less than 5 MB');
                    return;
                  }
                  setProfileImage(file);
                  setProfileImagePreview(URL.createObjectURL(file));
                }
              }}
            />
            <div className="text-center space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => document.getElementById('avatar-input')?.click()}
                type="button"
              >
                <Upload className="h-4 w-4" />
                {profileImage ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, GIF or WebP. Max 5 MB.
              </p>
              {!profileImage && (
                <p className="text-xs text-destructive">Profile photo is required</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <span className="text-base">🇮🇳</span>
                <span>+91</span>
              </div>
              <Input
                type="tel"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-[5.5rem] h-12 text-base bg-background/80 border-border/60 focus:border-primary tracking-wider"
                maxLength={10}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Indian mobile number only (10 digits starting with 6-9)
            </p>
            {phoneNumber && phoneNumber.length === 10 && !/^[6-9]\d{9}$/.test(phoneNumber) && (
              <p className="text-xs text-destructive">
                Number must start with 6, 7, 8, or 9.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const StepIcon = stepInfo[step].icon;
  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Complete Your Profile</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-border/40"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: '0%' }}
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step content card */}
        <Card className="glass border-border/30 overflow-hidden">
          <CardContent className="p-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Step icon & title */}
                <div className="flex flex-col items-center text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center mb-4"
                  >
                    <StepIcon className="h-7 w-7 text-primary" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {stepInfo[step].title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {stepInfo[step].subtitle}
                  </p>
                </div>

                {/* Step form */}
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 gap-4">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 0}
                className={cn(
                  'gap-1.5',
                  step === 0 && 'invisible'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              {isLastStep ? (
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canProceed() || submitting}
                  className="min-w-[140px]"
                >
                  {submitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Complete Setup
                    </span>
                  )}
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="gap-1.5"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === step
                  ? 'bg-primary w-6'
                  : i < step
                    ? 'bg-primary/40 w-2'
                    : 'bg-border w-2'
              )}
              layout
            />
          ))}
        </div>
      </div>
    </div>
  );
}
