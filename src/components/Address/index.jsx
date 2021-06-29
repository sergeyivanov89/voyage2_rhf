import * as React from "react";
import { Col, Row } from "reactstrap";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import get from "lodash.get";
import cloneDeep from "lodash.clonedeep";

import { ProductDataCtx } from "App";
import { DadataField, SelectField } from "components/fields";
import Flat from "./Flat";

const Address = ({ addressCdiLabel, path }) => {
  const { setValue } = useFormContext();
  const { touchedFields } = useFormState();
  const region = useWatch({ name: `${path}.region` });
  const productData = React.useContext(ProductDataCtx);

  const regions = cloneDeep(productData.registers.subjectsRF);

  const addressCdiRules = {
    onChange: (e) => {
      const { cdiData } = e.target.value;
      if (!cdiData) {
        return;
      }

      const region = regions.find(
        ({ fiasId }) => fiasId === cdiData.region_fias_id
      );
      if (region) {
        setValue(`${path}.region`, region, { shouldValidate: true });
      }
      setValue(`${path}.flat`, cdiData.flat || "", { shouldValidate: true });
    },
  };
  if (region || get(touchedFields, `${path}.region`)) {
    addressCdiRules.deps = `${path}.region`;
  }

  return (
    <Row form>
      <Col className="mb-3" xs={12}>
        <div className="mb-2">Регион</div>
        <SelectField
          name={`${path}.region`}
          isClearable
          options={regions}
          placeholder="Укажите регион"
        />
      </Col>
      <Col className="mb-3" md={10}>
        <div className="mb-2">{addressCdiLabel}</div>
        <DadataField
          name={`${path}.addressCdi`}
          rules={addressCdiRules}
          regionId={region?.fiasId}
        />
      </Col>
      <Col className="mb-3" md={2}>
        <div className="mb-2">Квартира</div>
        <Flat path={path} />
      </Col>
    </Row>
  );
};

export default Address;
