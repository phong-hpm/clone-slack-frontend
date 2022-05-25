import { FC, useRef, useState } from "react";

// components
import { Typography } from "@mui/material";
import UserDetailModal from "./UserDetailModal";
import { ModalProps } from "./Modal";

// types
import { UserType } from "store/slices/_types";
import { TypographyProps } from "@mui/system";

export interface UserNameCardProps {
  user?: UserType;
  modalProps?: Partial<ModalProps>;
  typographyProps?: TypographyProps;
}

const UserNameCard: FC<UserNameCardProps> = ({ user, typographyProps, modalProps }) => {
  const anchorRef = useRef<HTMLSpanElement>(null);

  const [isShowUserModal, setShowUserModal] = useState(false);

  return (
    <>
      <Typography
        ref={anchorRef}
        fontWeight={900}
        mr={1}
        onClick={() => setShowUserModal(true)}
        {...typographyProps}
      >
        {user?.name || "unknow"}
      </Typography>

      {!!user && (
        <UserDetailModal
          isOpen={isShowUserModal}
          anchorEl={anchorRef.current}
          user={user}
          onClose={() => setShowUserModal(false)}
          {...modalProps}
        />
      )}
    </>
  );
};

export default UserNameCard;
