import { RootState } from "@/store";
import { AvatarComponent } from "@rainbow-me/rainbowkit";
import { useSelector } from "react-redux";
import placeholderIcon from '@/assets/images/placeholder.jpg';


const CustomAvatar: any = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { profilePicture, userName } = user;
  const size = 70;
  return (
    <img
      src={profilePicture ?? placeholderIcon}
      className="h-20 w-20 rounded-full object-cover"
    />
  )
};

export default CustomAvatar;
