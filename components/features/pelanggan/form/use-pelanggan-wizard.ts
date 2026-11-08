import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch, type FieldErrors, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreatePelangganMutation } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/axios';
import { DEFAULT_OUTLET_IMAGE } from '@/constants/pelanggan-constants';
import {
  createCustomerSchema,
  type CreateCustomerInput,
} from '@/schemas/customer.schema';
import type {
  CreatePelangganInput,
  PelangganWithDetails,
} from '@/types/customer.types';
import type { KontakInputItem } from './types';

interface UsePelangganWizardArgs {
  basePath?: string;
  onBack?: () => void;
  onSave?: (newPelanggan: PelangganWithDetails) => void;
  initialStep?: number;
}

const DEFAULT_WIZARD_VALUES: CreateCustomerInput = {
  nama_outlet: '',
  tipe_outlet: 'Rumah Sakit',
  alamat: '',
  img_url: '',
  latitude: -6.208812,
  longitude: 106.845648,
  radius_kunjungan: 200,
  kontak: [],
};

export function usePelangganWizard({
  basePath = '/sales/pelanggan',
  onBack,
  onSave,
  initialStep = 1,
}: UsePelangganWizardArgs) {
  const router = useRouter();
  const createMutation = useCreatePelangganMutation();

  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema) as Resolver<CreateCustomerInput>,
    defaultValues: DEFAULT_WIZARD_VALUES,
    mode: 'onTouched',
  });

  const rawContacts = useWatch({ control: form.control, name: 'kontak' });
  const contacts: KontakInputItem[] = (rawContacts || []) as KontakInputItem[];

  const setContacts = (newContacts: KontakInputItem[]) => {
    form.setValue('kontak', newContacts, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleNextStep1 = async () => {
    const isStep1Valid = await form.trigger([
      'nama_outlet',
      'tipe_outlet',
      'alamat',
      'img_url',
    ]);
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleNextStep2 = async () => {
    const isStep2Valid = await form.trigger([
      'latitude',
      'longitude',
      'radius_kunjungan',
    ]);
    if (isStep2Valid) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (onBack) {
      onBack();
    } else {
      router.push(basePath);
    }
  };

  // Navigasi lewat stepper indicator di header
  const handleStepClick = async (targetStep: number) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }
    if (targetStep === 2) {
      const isStep1Valid = await form.trigger([
        'nama_outlet',
        'tipe_outlet',
        'alamat',
        'img_url',
      ]);
      if (isStep1Valid) setCurrentStep(2);
    } else if (targetStep === 3) {
      const isStep1Valid = await form.trigger([
        'nama_outlet',
        'tipe_outlet',
        'alamat',
        'img_url',
      ]);
      const isStep2Valid = await form.trigger([
        'latitude',
        'longitude',
        'radius_kunjungan',
      ]);
      if (isStep1Valid && isStep2Valid) setCurrentStep(3);
    }
  };

  const onValid = async (values: CreateCustomerInput) => {
    setServerError(null);

    const payload: CreatePelangganInput = {
      nama_outlet: values.nama_outlet.trim(),
      tipe_outlet: values.tipe_outlet,
      alamat: values.alamat.trim(),
      img_url: values.img_url || DEFAULT_OUTLET_IMAGE,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      radius_kunjungan: Number(values.radius_kunjungan),
      kontak: (values.kontak || []).map((c) => ({
        nama: c.nama.trim(),
        jabatan: c.jabatan.trim(),
        no_telp: c.no_telp.trim(),
        email: c.email.trim(),
      })),
    };

    try {
      const response = await createMutation.mutateAsync(payload);
      const createdPelanggan = response.data;

      if (onSave) {
        onSave(createdPelanggan);
      } else {
        const targetId = createdPelanggan?.id_pelanggan;
        if (targetId) {
          router.push(`${basePath}/${targetId}`);
        } else {
          router.push(basePath);
        }
      }
    } catch (error: unknown) {
      const msg = getErrorMessage(error);
      setServerError(msg);
      form.setError('root.server', { message: msg });
    }
  };

  const onInvalid = (errors: FieldErrors<CreateCustomerInput>) => {
    if (errors.nama_outlet || errors.tipe_outlet || errors.alamat || errors.img_url) {
      setCurrentStep(1);
    } else if (errors.latitude || errors.longitude || errors.radius_kunjungan) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = (finalContacts: KontakInputItem[]) => {
    form.setValue('kontak', finalContacts, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.handleSubmit(onValid, onInvalid)();
  };

  return {
    form,
    currentStep,
    isSubmitting: createMutation.isPending,
    serverError,
    contacts,
    setContacts,
    handleNextStep1,
    handleNextStep2,
    handlePrevStep,
    handleStepClick,
    handleFinalSubmit,
  };
}
