import { FC, useState } from "react";

// components
import { Box, List, Menu, MenuItem, MenuProps, Tooltip, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, deviceKind } from "utils/constants";
import { MediaDeviceInfoType } from "../../_types";

const settingOptions = [
  { label: "Camera", kind: deviceKind.CAMERA },
  { label: "Microphone", kind: deviceKind.MICROPHONE },
];

export interface RecordSettingMenuProps extends MenuProps {
  devices?: MediaDeviceInfoType[];
  selectedAudioId: string;
  selectedVideoId: string;
  onSelectAudioDevice: (deviceId: string) => void;
  onSelectVideoDevice: (deviceId: string) => void;
}

const RecordSettingMenu: FC<RecordSettingMenuProps> = ({
  devices,
  selectedAudioId,
  selectedVideoId,
  onSelectAudioDevice,
  onSelectVideoDevice,
  ...props
}) => {
  const [selectedSetting, setSelectedSeting] = useState("");

  const renderDevicesList = (kind: string) => {
    const devicesList = (devices || []).filter((device) => device.kind === kind);

    return (
      <List component="div" disablePadding>
        {devicesList.map((device) => {
          const isSelected =
            device.deviceId === selectedAudioId || device.deviceId === selectedVideoId;

          return (
            <MenuItem
              selected={isSelected}
              key={device.label}
              onClick={() =>
                kind === deviceKind.MICROPHONE
                  ? onSelectAudioDevice(device.deviceId)
                  : onSelectVideoDevice(device.deviceId)
              }
            >
              <Typography>{device.label}</Typography>
            </MenuItem>
          );
        })}
      </List>
    );
  };

  return (
    <Menu
      variant="menu"
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      PaperProps={{ sx: { minWidth: "225px !important" } }}
      sx={{ zIndex: 1500 }}
      {...props}
    >
      {settingOptions.map((option) => {
        return (
          <Tooltip
            key={option.kind}
            arrow={false}
            classes={{ popper: "tooltip-menu auto-width" }}
            placement="right-start"
            title={renderDevicesList(option.kind)}
            onOpen={() => setSelectedSeting(option.kind)}
            onClose={() => setSelectedSeting("")}
            sx={{ offsetPosition: "left top" }}
          >
            <MenuItem selected={selectedSetting === option.kind}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>{option.label}</Typography>
                <SlackIcon color={color.MAX_SOLID} icon="chevron-right" />
              </Box>
            </MenuItem>
          </Tooltip>
        );
      })}
    </Menu>
  );
};

export default RecordSettingMenu;
