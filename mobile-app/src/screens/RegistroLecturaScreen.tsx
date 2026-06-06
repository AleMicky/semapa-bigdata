import { createLectura } from '../lib/api/lecturas.api';
import { colors } from '../theme/colors';
import type { MedidorPendiente } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const schema = z
  .object({
    medidorIot: z.string().min(1, 'Medidor obligatorio'),
    lecturaAnterior: z.number().min(0),
    lecturaActual: z.number().min(0),
    observacion: z.string().optional(),
  })
  .refine((d) => d.lecturaActual >= d.lecturaAnterior, {
    message: 'La lectura actual debe ser mayor o igual a la anterior',
    path: ['lecturaActual'],
  });

type FormData = z.infer<typeof schema>;

export function RegistroLecturaScreen({
  medidor,
  onSuccess,
  onCancel,
}: {
  medidor?: MedidorPendiente | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [geo, setGeo] = useState('—');
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      medidorIot: medidor?.medidorIot ?? '',
      lecturaAnterior: medidor?.ultimaLectura ?? 0,
      lecturaActual: (medidor?.ultimaLectura ?? 0) + 5,
      observacion: '',
    },
  });

  const anterior = watch('lecturaAnterior');
  const actual = watch('lecturaActual');
  const consumo = Math.max(0, Number(actual) - Number(anterior));

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setGeo(`${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`);
        } else {
          setGeo('-17.39350, -66.15700 (mock)');
        }
      } catch {
        setGeo('-17.39350, -66.15700 (mock)');
      }
    })();
  }, []);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await createLectura({
        medidorIot: data.medidorIot,
        lecturaAnterior: data.lecturaAnterior,
        lecturaActual: data.lecturaActual,
        fechaHoraLectura: new Date().toISOString(),
        radiobase: 'MANUAL',
        estado: 'NORMAL',
      });
      Alert.alert('Éxito', 'Lectura registrada correctamente');
      onSuccess();
    } catch {
      Alert.alert('Error', 'No se pudo registrar la lectura. Verifique la conexión al backend.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registro de lectura manual</Text>

      <Text style={styles.label}>Medidor IoT *</Text>
      <Controller
        control={control}
        name="medidorIot"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="IOT-00001" />
        )}
      />
      {errors.medidorIot && <Text style={styles.error}>{errors.medidorIot.message}</Text>}

      <Text style={styles.label}>Lectura anterior</Text>
      <Controller
        control={control}
        name="lecturaAnterior"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={String(value)}
            onChangeText={(t) => onChange(Number(t) || 0)}
            keyboardType="numeric"
          />
        )}
      />

      <Text style={styles.label}>Lectura actual</Text>
      <Controller
        control={control}
        name="lecturaActual"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            value={String(value)}
            onChangeText={(t) => onChange(Number(t) || 0)}
            keyboardType="numeric"
          />
        )}
      />
      {errors.lecturaActual && <Text style={styles.error}>{errors.lecturaActual.message}</Text>}

      <View style={styles.consumoBox}>
        <Text style={styles.consumoLabel}>Consumo calculado</Text>
        <Text style={styles.consumoValue}>{consumo} m³</Text>
      </View>

      <Text style={styles.label}>Observación</Text>
      <Controller
        control={control}
        name="observacion"
        render={({ field: { onChange, value } }) => (
          <TextInput style={[styles.input, styles.textArea]} value={value} onChangeText={onChange} multiline />
        )}
      />

      <Text style={styles.label}>Geolocalización</Text>
      <Text style={styles.geo}>{geo}</Text>

      <TouchableOpacity style={styles.photoBtn} onPress={pickPhoto}>
        <Text style={styles.photoBtnText}>📷 Fotografía del medidor</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.photo} />}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.disabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Enviando...' : 'Registrar lectura'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 12, marginBottom: 4 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  error: { color: colors.error, fontSize: 12, marginTop: 2 },
  consumoBox: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumoLabel: { fontSize: 14, color: colors.primary },
  consumoValue: { fontSize: 20, fontWeight: 'bold', color: colors.primary },
  geo: { fontSize: 13, color: colors.grayDark, fontFamily: 'monospace' },
  photoBtn: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  photoBtnText: { fontSize: 14, color: colors.primary },
  photo: { width: '100%', height: 200, borderRadius: 10, marginTop: 12 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: { color: colors.grayDark, fontWeight: '600' },
  submitBtn: { flex: 2, backgroundColor: colors.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { color: colors.white, fontWeight: '600' },
  disabled: { opacity: 0.6 },
});
