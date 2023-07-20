---
title: React to Hooks (MobX)
---

This is an alternative version of the React to Hooks pattern that uses MobX.

tags: #react, #migration, #complex, #hidden

```grit
// Most of the logic for this pattern is in react_hooks.grit
// https://github.com/getgrit/js/blob/main/.grit/patterns/react_hooks.grit

pattern wrapped_first_step() {
  $use_ref_from = `useRefFrom`,
  first_step($use_ref_from)
}

sequential {
    file(body = program(statements = some bubble($program) wrapped_first_step())),
    file(body = second_step()),
    file(body = second_step()),
    file(body = second_step()),
    file($body) where {
      $body <: program($statements),
      $statements <: bubble($body, $program) and {
        maybe adjust_imports(),
        add_more_imports(use_ref_from=`"'~/hooks/useRefFrom'"`),
      }
    }
}

```

## Input for playground

```js
import React from "react";
import styled from "styled-components";

import { CustomComponent } from "components/CustomComponent/CustomComponent";
import { IBrand } from "models/brand";
import { Banner, IBannerProps } from "models/viewport";
import { BannerPicture } from "models/banner";

export interface IMainProps {
  bannerStuff: IBannerProps;
  dataHeaderRef?: React.RefCallback<HTMLElement>;
}

class BrandHeaderBase extends React.Component<
  IMainProps & IBrandProps
> {
  render() {
    const {
      bannerStuff,
      dataHeaderRef,
      brandName
    } = this.props;
    return (
      <Banner>
        <h3>Some text</h3>
        <p>Some more text</p>
        {this.renderBannerDetails()}
      </Banner>
    );
  }

  private name = "BrandHeader";

  private invoker: React.RefObject<HTMLElement> = React.createRef();
  private util: number = 9;

  private renderBannerDetails = () => {
    if (!getGoodStuff()) {
      return this.props.viewport.isMedium ? (
        <InternalBrand
            brand={brand}
            height={240}
          />
      ) : null;
    } else {
      const CustomBanner: React.FC<{ height: number }> = ({
        height,
      }) => (
        <InternalBrand
            brand={brand}
            height={height}
          />
      );

      return (
        <ResponsiveBanner>
          <CustomBanner height={240} />
        </ResponsiveBanner>
      );
    }
  };
}
```

```ts
import React from 'react';
import styled from 'styled-components';

import { CustomComponent } from 'components/CustomComponent/CustomComponent';
import { IBrand } from 'models/brand';
import { Banner, IBannerProps } from 'models/viewport';
import { BannerPicture } from 'models/banner';

import { useRefFrom } from '~/hooks/useRefFrom';

export interface IMainProps {
  bannerStuff: IBannerProps;
  dataHeaderRef?: React.RefCallback<HTMLElement>;
}

export const BrandHeaderBase: React.FC<IMainProps & IBrandProps> = (props) => {
  const { bannerStuff, dataHeaderRef, brandName } = props;

  const renderBannerDetails = () => {
    if (!getGoodStuff()) {
      return props.viewport.isMedium ? <InternalBrand brand={brand} height={240} /> : null;
    } else {
      const CustomBanner: React.FC<{ height: number }> = ({ height }) => (
        <InternalBrand brand={brand} height={height} />
      );

      return (
        <ResponsiveBanner>
          <CustomBanner height={240} />
        </ResponsiveBanner>
      );
    }
  };

  const name = useRefFrom(() => 'BrandHeader').current;
  const invoker = useRefFrom(() => React.createRef()).current;
  const util = useRefFrom(() => 9).current;
  return (
    <Banner>
      <h3>Some text</h3>
      <p>Some more text</p>
      {this.renderBannerDetails()}
    </Banner>
  );
};
```
