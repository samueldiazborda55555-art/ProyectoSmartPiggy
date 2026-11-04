import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colores } from '../../constants/colores';

// Azul del arco (aproximado del Figma, todavía no está en colores.ts)
const AZUL_ARCO = '#0066FF';

interface Props {
  porcentaje: number; // de 0 a 100
  tamano?: number;
  grosor?: number;
  colorArco?: string;
  colorFondo?: string;
  mostrarTexto?: boolean; // muestra el porcentaje en el centro (por defecto sí)
  children?: ReactNode; // si hay contenido (ej. un ícono), va en el centro en lugar del texto
}

export default function ProgresoCircular({
  porcentaje,
  tamano = 100,
  grosor = 10,
  colorArco = AZUL_ARCO,
  colorFondo = colores.borde,
  mostrarTexto = true,
  children,
}: Props) {
  // Si llega un número fuera de 0 a 100, se corrige
  const valor = Math.max(0, Math.min(100, porcentaje));

  const centro = tamano / 2;
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const desplazamiento = circunferencia * (1 - valor / 100);

  return (
    <View style={{ width: tamano, height: tamano }}>
      <Svg
        width={tamano}
        height={tamano}
        style={{ transform: [{ rotate: '-90deg' }] }}
      >
        {/* Círculo de fondo */}
        <Circle
          cx={centro}
          cy={centro}
          r={radio}
          stroke={colorFondo}
          strokeWidth={grosor}
          fill="none"
        />
        {/* Arco de color: su largo depende del porcentaje */}
        <Circle
          cx={centro}
          cy={centro}
          r={radio}
          stroke={colorArco}
          strokeWidth={grosor}
          fill="none"
          strokeDasharray={circunferencia}
          strokeDashoffset={desplazamiento}
          strokeLinecap="round"
        />
      </Svg>

      {/* Centro: contenido que le pasen, o el porcentaje */}
      <View style={styles.centro}>
        {children ??
          (mostrarTexto && (
            <Text style={[styles.texto, { fontSize: tamano * 0.22 }]}>
              {Math.round(valor)}%
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
},
  texto: {
    fontWeight: '700',
    color: colores.textoPrincipal,
  },
});