import React from 'react';
import Svg, { Path, Rect, G, Circle } from 'react-native-svg';

const BooksIcon = ({ width = 80, height = 60 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 80">
      {/* === NEECHE WALI BOOK (PINK) === */}
      <G>
        {/* Book ka base */}
        <Rect x="10" y="58" width="65" height="12" rx="2" fill="#F472B6" />
        {/* Book ka top edge */}
        <Rect x="10" y="58" width="65" height="4" rx="2" fill="#EC4899" />
        {/* Book ka side (3D effect) */}
        <Rect x="10" y="58" width="5" height="12" rx="1" fill="#BE185D" />
        {/* Pages (white lines) */}
        <Rect x="15" y="62" width="55" height="1.5" fill="#FCE7F3" />
        <Rect x="15" y="65" width="55" height="1.5" fill="#FCE7F3" />
      </G>

      {/* === BEECH WALI BOOK (BLUE) === */}
      <G>
        <Rect x="15" y="44" width="55" height="12" rx="2" fill="#60A5FA" />
        <Rect x="15" y="44" width="55" height="4" rx="2" fill="#3B82F6" />
        <Rect x="15" y="44" width="5" height="12" rx="1" fill="#1D4ED8" />
        <Rect x="20" y="48" width="45" height="1.5" fill="#DBEAFE" />
        <Rect x="20" y="51" width="45" height="1.5" fill="#DBEAFE" />
      </G>

      {/* === UPAR WALI BOOK (GREEN) === */}
      <G>
        <Rect x="20" y="30" width="45" height="12" rx="2" fill="#34D399" />
        <Rect x="20" y="30" width="45" height="4" rx="2" fill="#10B981" />
        <Rect x="20" y="30" width="5" height="12" rx="1" fill="#047857" />
        <Rect x="25" y="34" width="35" height="1.5" fill="#D1FAE5" />
        <Rect x="25" y="37" width="35" height="1.5" fill="#D1FAE5" />
      </G>

      {/* === BOOKMARK (YELLOW) === */}
      <G>
        <Rect x="55" y="30" width="5" height="14" fill="#FBBF24" />
        <Path d="M55 44 L57.5 40 L60 44 Z" fill="#F59E0B" />
      </G>

      {/* === PENCIL (RIGHT SIDE) === */}
      <G>
        {/* Pencil body */}
        <Rect x="78" y="35" width="6" height="30" rx="1" fill="#FCD34D" />
        {/* Pencil tip */}
        <Path d="M78 65 L81 72 L84 65 Z" fill="#FBBF24" />
        {/* Pencil tip (lead) */}
        <Path d="M80 70 L81 72 L82 70 Z" fill="#1F2937" />
        {/* Pencil top (eraser) */}
        <Rect x="78" y="32" width="6" height="3" rx="1" fill="#F472B6" />
        {/* Pencil lines */}
        <Rect x="78" y="45" width="6" height="1" fill="#F59E0B" />
        <Rect x="78" y="55" width="6" height="1" fill="#F59E0B" />
      </G>
    </Svg>
  );
};

export default BooksIcon;