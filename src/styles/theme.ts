const fontGenerator = (
  fontFamily = 'SUIT',
  fontSize = '1rem',
  fontWeight = 'normal',
  lineHeight = 'normal',
  letterSpacing = 'normal',
) => ({
  'font-family': fontFamily,
  'font-weight': fontWeight,
  'font-size': fontSize,
  'line-height': lineHeight,
  'letter-spacing': letterSpacing,
});

const colors = {
  // 배경색
  Bg: '#FAFAFA',
  Bg02: '#F5EBE5',
  // 포인트 색상
  Point: '#FFD232',

  //상태 색상
  Success: '#0F851A', //초록색
  Error: '#F03F40', //빨간색
  Focused: '#C0C0C0',
  //Focused: '#8A8A8A', //짙은회색

  // 메인 색상
  Orange00: '#FFF0EC',
  Orange01: '#FF6E3F',
  Orange02: '#E66339',
  Highlight: '#BE5D3A',
  Gray01: '#F2F2F2',
  Gray02: '#AFAFAF',
  Gray03: '#888888',

  // 텍스트 색상
  Black01: '#2A2A2A',
  Black02: '#414141',
  //Black02: '#C0C0C0',

  // 기타 색상
  White: '#FFFFFF',
  Black: '#000000',
};

const theme = {
  colors,

  fonts: {
    Bold32: fontGenerator('SUIT-Bold', '32px', '700', 'auto', 'normal'),
    // Title
    ExtraBold26: fontGenerator(
      'SUIT-ExtraBold',
      '26px',
      '800',
      'auto',
      'normal',
    ),
    Bold26: fontGenerator('SUIT-Bold', '26px', '700', 'auto', 'normal'),
    ExtraBold24: fontGenerator(
      'SUIT-ExtraBold',
      '24px',
      '800',
      'auto',
      'normal',
    ),
    Bold24: fontGenerator('SUIT-Bold', '24px', '700', 'auto', 'normal'),
    ExtraBold20: fontGenerator(
      'SUIT-ExtraBold',
      '20px',
      '800',
      'auto',
      'normal',
    ),
    Bold20: fontGenerator('SUIT-Bold', '20px', '700', 'auto', 'normal'),
    ExtraBold18: fontGenerator(
      'SUIT-ExtraBold',
      '18px',
      '800',
      'auto',
      'normal',
    ),
    Bold18: fontGenerator('SUIT-Bold', '18px', '700', 'auto', 'normal'),

    // SubTitle
    ExtraBold16: fontGenerator(
      'SUIT-ExtraBold',
      '16px',
      '800',
      'auto',
      'normal',
    ),
    Bold16: fontGenerator('SUIT-Bold', '16px', '700', 'auto', 'normal'),
    SemiBold16: fontGenerator('SUIT-SemiBold', '16px', '600', 'auto', 'normal'),
    SemiBold15: fontGenerator('SUIT-SemiBold', '15px', '600', 'auto', 'normal'),
    Medium16: fontGenerator('SUIT-Medium', '16px', '500', 'auto', 'normal'),

    // Body
    ExtraBold14: fontGenerator(
      'SUIT-ExtraBold',
      '14px',
      '800',
      'auto',
      'normal',
    ),
    Bold14: fontGenerator('SUIT-Bold', '14px', '700', 'auto', 'normal'),
    SemiBold14: fontGenerator('SUIT-SemiBold', '14px', '600', 'auto', 'normal'),
    Medium14: fontGenerator('SUIT-Medium', '14px', '500', 'auto', 'normal'),

    // Caption
    ExtraBold12: fontGenerator(
      'SUIT-ExtraBold',
      '12px',
      '800',
      'auto',
      'normal',
    ),
    Bold12: fontGenerator('SUIT-Bold', '12px', '700', 'auto', 'normal'),
    SemiBold12: fontGenerator('SUIT-SemiBold', '12px', '600', 'auto', 'normal'),
    Medium12: fontGenerator('SUIT-Medium', '12px', '500', 'auto', 'normal'),
    SemiBold10: fontGenerator('SUIT-SemiBold', '10px', '600', 'auto', 'normal'),
  },
};

export default theme;
