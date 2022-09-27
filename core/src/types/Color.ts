type White = 'white';
type Black = 'black';

type Gray =
  | 'gray-0'
  | 'gray-1'
  | 'gray-2'
  | 'gray-3'
  | 'gray-4'
  | 'gray-5'
  | 'gray-6'
  | 'gray-7'
  | 'gray-8'
  | 'gray-9';

type Red =
  | 'red-0'
  | 'red-1'
  | 'red-2'
  | 'red-3'
  | 'red-4'
  | 'red-5'
  | 'red-6'
  | 'red-7'
  | 'red-8'
  | 'red-9';

type Blue =
  | 'blue-0'
  | 'blue-1'
  | 'blue-2'
  | 'blue-3'
  | 'blue-4'
  | 'blue-5'
  | 'blue-6'
  | 'blue-7'
  | 'blue-8'
  | 'blue-9';

type Color =
  | White
  | Black
  | Gray
  | Blue;

export default Color;
