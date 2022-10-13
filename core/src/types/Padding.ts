type PaddingVertical =
  | 'none small'
  | 'none medium'
  | 'none large'
  | 'small none'
  | 'small small'
  | 'small medium'
  | 'small large'
  | 'medium none'
  | 'medium small'
  | 'medium medium'
  | 'medium large'
  | 'large none'
  | 'large small'
  | 'large medium'
  | 'large large'
  ;

type Padding =
  | 'none'
  | 'xxsmall'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge'
  ;

type CombinedPadding = Padding | PaddingVertical;

export default Padding;

export {
  type CombinedPadding,
};
