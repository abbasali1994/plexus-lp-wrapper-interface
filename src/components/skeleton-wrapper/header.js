import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { assets } from "../../utils/images";
import "./index.scss";

export default function HeaderWrapper({ checks, children }) {
  let images = [];
  checks.map((key) => {
    images = [...images, ...assets[key]];
    return 0;
  });
  const [loading, setloading] = useState(images.length);
  const [fontsLoading,] = useState(!document.fonts.load("14px 'Nova Mono Regular'"));

  let wrapper = <SkeletonContent />;

  return (
    <>
      {loading > 0 || fontsLoading ? wrapper : children}
      {
        <>
          <div hidden>
            {images.map((src, index) => {
              return (
                <img
                  key={index}
                  src={src.image.default}
                  alt={"img"}
                  onLoad={() => setloading(loading - 1)}
                />
              );
            })}
          </div>
          <div className="font-skeleton" hidden={!fontsLoading}>
            <i style={{ fontFamily: "Nova Mono Regular" }}>.</i>
          </div>
        </>
      }
    </>
  );
}

function SkeletonContent() {
  return (
    <SkeletonTheme color="#060818" highlightColor="#191E3A">
      <Row className="header">
        <Col lg={3} xs={8}>
          <Skeleton height={40} width={"100%"} />
        </Col>
        <Col lg={6} xs={4}>
          
        </Col>
        <Col lg={3} xs={12}>
          <Skeleton height={40} width={"100%"} />
        </Col>
      </Row>
    </SkeletonTheme>
  );
}
