import { MOCK_CREDENTIALS, saveMockAuth } from '../lib/auth';
import { colors } from '../theme/colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

const schema = z.object({
  usuario: z.string().min(1, 'Usuario requerido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
});

type FormData = z.infer<typeof schema>;

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { usuario: '', contrasena: '' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    await saveMockAuth(data.usuario);
    setLoading(false);
    onLogin();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>SEMAPA</Text>
        <Text style={styles.subtitle}>Lecturas en campo</Text>

        <Text style={styles.label}>Usuario</Text>
        <Controller
          control={control}
          name="usuario"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              placeholder="lector"
            />
          )}
        />
        {errors.usuario && <Text style={styles.error}>{errors.usuario.message}</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <Controller
          control={control}
          name="contrasena"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              secureTextEntry
              placeholder="••••••••"
            />
          )}
        />
        {errors.contrasena && <Text style={styles.error}>{errors.contrasena.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ingresar</Text>}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Demo: {MOCK_CREDENTIALS.usuario} / {MOCK_CREDENTIALS.contrasena}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 24 },
  logo: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.grayDark, textAlign: 'center', marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 4, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  error: { color: colors.error, fontSize: 12, marginTop: 2 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  hint: { fontSize: 11, color: colors.grayDark, textAlign: 'center', marginTop: 16 },
});
