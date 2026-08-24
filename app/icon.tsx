import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#060608',
          borderRadius: '16px',
          border: '2px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 0 16px rgba(14, 165, 233, 0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 900,
          letterSpacing: '-1px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            M
          </span>
          <span
            style={{
              color: '#38BDF8',
              fontSize: 34,
              fontWeight: 900,
              marginLeft: '1px',
            }}
          >
            E
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
