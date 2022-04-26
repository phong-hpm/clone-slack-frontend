import { FC } from "react";
import { makeStyles } from "@mui/styles";
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

const useStyles = makeStyles({
  primary: {
    color: "#d1d2d3",
    backgroundColor: "transparent",
    "&:MuiOutlinedInput": {
      borderColor: "#fff",
    },
    "&:disabled": {
      color: (props: MuiTextFieldProps) => {
        if (props.color === "primary") return "rgba(209, 210, 211, 0.75)";
      },
    },
  },
});

export type TextFieldProps = MuiTextFieldProps & {};

const TextField: FC<TextFieldProps> = ({
  variant = "outlined",
  color = "primary",
  size = "medium",
  ...props
}) => {
  const classes = useStyles({ size, variant, color, ...props });

  return (
    <MuiTextField
      variant={variant}
      color={color}
      size={size}
      {...props}
      // className={classes.primary}
      // inputProps={{
      //   className: classes.primary,
      // }}
    />
  );
};

export default TextField;
