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
