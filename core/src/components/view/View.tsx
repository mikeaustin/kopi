import React, { useCallback, useEffect } from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';

import useStyles from './styles.js';
import { useBorderColorStyles } from '../../styles/borderColorStyles.js';
import { useAlignVerticalStyles, useAlignHorizontalStyles } from '../../styles/alignStyles.js';
import { usePaddingVerticalStyles, usePaddingHorizontalStyles } from '../../styles/paddingStyles.js';
import useFillColorStyles from '../../styles/fillColorStyles.js';

import ViewContext from './ViewContext.js';

import Color from '../../types/Color';
import Padding, { CombinedPadding } from '../../types/Padding';

function paddingToStyle(padding: CombinedPadding | undefined): [Padding | undefined, Padding | undefined] {
  switch (padding) {
    case 'xsmall':
      return ['xsmall', 'xsmall'];
    case 'small':
      return ['small', 'small'];
    case 'medium':
      return ['medium', 'medium'];
    case 'large':
      return ['large', 'large'];
    case 'none xsmall':
      return ['none', 'xsmall'];
    case 'none small':
      return ['none', 'small'];
    case 'none medium':
      return ['none', 'medium'];
    case 'none large':
      return ['none', 'large'];
    case 'xsmall none':
      return ['xsmall', 'none'];
    case 'small none':
      return ['small', 'none'];
    case 'small medium':
      return ['small', 'medium'];
    case 'small large':
      return ['small', 'large'];
    case 'medium none':
      return ['medium', 'none'];
    case 'medium small':
      return ['medium', 'small'];
    default:
      return [undefined, undefined];
  }
}

type ShorthandAlign =
  | 'top left' | 'top' | 'top right'
  | 'left' | 'center' | 'right'
  | 'bottom left' | 'bottom' | 'bottom right'
  ;

type Align = 'start' | 'center' | 'end';

function alignToStyle(align: ShorthandAlign | undefined): [Align | undefined, Align | undefined] {
  switch (align) {
    case 'top left':
      return ['start', 'start'];
    case 'top':
      return ['start', 'center'];
    case 'top right':
      return ['start', 'end'];
    case 'left':
      return ['center', 'start'];
    case 'center':
      return ['center', 'center'];
    case 'right':
      return ['center', 'end'];
    case 'bottom left':
      return ['end', 'start'];
    case 'bottom':
      return ['end', 'center'];
    case 'bottom right':
      return ['end', 'end'];
    default:
      return [undefined, undefined];
  }
}

interface ColorThemeMessage {
  type: string,
  theme: {
    contentColor: string,
    panelColor: string,
    dividerColor: string,
    textColor: string,
    buttonColor: string,
  };
}

interface ViewProps extends React.ComponentProps<'div'> {
  as?: React.ElementType,
  flex?: boolean,
  horizontal?: boolean,
  align?: ShorthandAlign,
  fillColor?: Color | 'theme-content' | 'theme-panel' | 'theme-divider' | 'theme-button',
  padding?: CombinedPadding,
  border?: boolean,
  borderColor?: Color,
  disabled?: boolean,
  viewBox?: string,
  className?: string,
  children?: React.ReactNode,
}

const View = ({
  as: Component = 'div',
  flex,
  horizontal,
  align,
  fillColor,
  padding,
  border,
  borderColor,
  disabled,
  viewBox,
  className,
  children,
  ...props
}: ViewProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const handleWindowMessage = useCallback((event: MessageEvent<ColorThemeMessage>) => {
    if (event.data.type === 'setColorTheme') {
      document.documentElement.style.setProperty('--theme-content-color', event.data.theme.contentColor);
      document.documentElement.style.setProperty('--theme-panel-color', event.data.theme.panelColor);
      document.documentElement.style.setProperty('--theme-divider-color', event.data.theme.dividerColor);
      document.documentElement.style.setProperty('--theme-text-color', event.data.theme.textColor);
      document.documentElement.style.setProperty('--theme-button-color', event.data.theme.buttonColor);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-content-color', OpenColor.white);
    document.documentElement.style.setProperty('--theme-panel-color', OpenColor.gray[1]);
    document.documentElement.style.setProperty('--theme-divider-color', OpenColor.gray[3]);
    document.documentElement.style.setProperty('--theme-text-color', OpenColor.gray[8]);
    document.documentElement.style.setProperty('--theme-button-color', OpenColor.gray[3]);

    window.addEventListener('message', handleWindowMessage);

    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [handleWindowMessage]);

  const styles = useStyles();
  const borderColorStyles = useBorderColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();
  const paddingHorizontalStyles = usePaddingHorizontalStyles();
  const fillColorStyles = useFillColorStyles();

  const [paddingVertical, paddingHorizontal] = paddingToStyle(padding);
  const [alignVertical, alignHorizontal] = alignToStyle(align);

  const viewClassName = clsx(
    styles.View,
    flex && styles.flex,
    horizontal && styles.horizontal,
    fillColor && fillColorStyles[fillColor],
    border && borderColorStyles[borderColor ?? 'gray-3'],
    alignVertical && alignVerticalStyles[alignVertical],
    alignHorizontal && alignHorizontalStyles[alignHorizontal],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    paddingHorizontal && paddingHorizontalStyles[paddingHorizontal],
    className,
  );

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component ref={ref} disabled={disabled} viewBox={viewBox} className={viewClassName} {...props}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default React.forwardRef(View);
