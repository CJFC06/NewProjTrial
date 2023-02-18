import {
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "1rem",
};

const UserWidget = ({ friendId, userId, picturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const [open, setOpen] = React.useState(false);
  const handleOpenEditProfile = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ ufriends: data }));
  };

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const isFriend = friends.find((friend) => friend._id !== userId);

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${userId}`)}>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <FlexBetween gap="1rem">
          {/* <ManageAccountsOutlined /> */}
          {userId !== _id ? (
            <IconButton onClick={() => patchFriend()}>
              {isFriend ? (
                // <PersonRemoveOutlined sx={{ color: primaryDark }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: palette.background.text,
                    backgroundColor: palette.primary.bg,
                    borderRadius: "3rem",
                    borderColor: palette.background.text,
                  }}
                >
                  Following
                </Button>
              ) : (
                // <PersonAddOutlined sx={{ color: primaryDark }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: palette.background.text,
                    backgroundColor: palette.primary.bg,
                    borderRadius: "3rem",
                  }}
                >
                  Follow
                </Button>
              )}
            </IconButton>
          ) : (
            <Button
              variant="outlined"
              sx={{
                color: palette.background.text,
                backgroundColor: palette.primary.bg,
                borderRadius: "3rem",
                borderColor: palette.background.text,
              }}
              onClick={handleOpenEditProfile}
            >
              Edit Profile
            </Button>
          )}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} justifyContent="flex-end">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Profile
              </Typography>
              <TextField
                id="outlined-basic"
                label="First name"
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                fullWidth
              />
              <TextField
                id="outlined-basic"
                label="Last name"
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                fullWidth
              />
              <TextField
                id="outlined-basic"
                label="Location"
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                fullWidth
              />
              <TextField
                id="outlined-basic"
                label="Occupation"
                variant="outlined"
                sx={{ marginTop: "1rem" }}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{
                  color: palette.background.text,
                  backgroundColor: palette.primary.bg,
                  borderRadius: "3rem",
                  borderColor: palette.background.text,
                  marginTop: "1rem",
                }}
                onClick={handleOpenEditProfile}
                fullWidth
              >
                Save
              </Button>
            </Box>
          </Modal>
        </FlexBetween>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
