import { Button } from "reactstrap";
import { useFormState } from "react-hook-form";

const SubmitButton = ({ disabled }) => {
  const { isSubmitting } = useFormState();

  return (
    <div className="mt-3 text-right">
      <Button color="primary" disabled={disabled || isSubmitting} type="submit">
        Оплатить
      </Button>
    </div>
  );
};

export default SubmitButton;
