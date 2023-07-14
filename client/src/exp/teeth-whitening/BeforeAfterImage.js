import React from 'react';
import BeforeAfterSlider from 'react-before-after-slider-component';

export function BeforeAfterImage({ before, after, width, height }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 'calc(100% - 100px)',
      }}
    >
      <BeforeAfterSlider
        currentPercentPosition={50}
        firstImage={{ imageUrl: after }}
        secondImage={{ imageUrl: before }}
        withResizeFeel
        feelsOnlyTheDelimiter
      />
    </div>
  );
}
