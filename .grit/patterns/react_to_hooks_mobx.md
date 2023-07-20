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
        {bannerStuff && (
          <InternalBrand
            brand={brand}
            height={240}
          />
        )}
      </Banner>
    );
  }

  private renderBannerDetails = () => {
    if (!getSettingBrandPageFollowups()) {
      return this.props.viewport.isMedium ? (
        <InternalBrand
            brand={brand}
            height={240}
          />
      ) : null;
    } else {
      const CustomBanner: React.FC<{ $height: number }> = ({
        $height,
      }) => (
        <InternalBrand
            brand={brand}
            height={240}
          />
      );

      return (
        <ResponsiveBanner>
          <InternalBrand
            brand={brand}
            height={240}
          />
        </ResponsiveBanner>
      );
    }
  };
}
```
