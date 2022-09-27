type PaddingVertical =
  | 'small small'
  | 'small medium'
  | 'small large'
  | 'medium small'
  | 'medium medium'
  | 'medium large'
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
