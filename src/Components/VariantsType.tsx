import { FC } from "react";
import { Control } from "react-hook-form";
import Input from "./Input";
import TextArea from "./TextArea";

interface VariantsTypeInterface {
  control: Control;
  i: string | number;
}

const VariantsType: FC<VariantsTypeInterface> = ({ control, i }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="grow space-y-1.5 md:space-y-2">
        <Input
          name={`variants.${i}.name`}
          control={control}
          placeholder="Name for variant"
        />
        <TextArea
          rows={7}
          name={`variants.${i}.properties`}
          control={control}
          placeholder="property:value (e.g: color:red)"
        />
      </div>
    </div>
  );
};

export default VariantsType;
