"use client";

import { useUser } from "@/hooks/use-user";
import { getAvatarByRole } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserAvatar = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const { user } = useUser();

  const avatar = getAvatarByRole(user?.role);

  return (
    <Avatar {...props}>
      <AvatarImage src={avatar} alt={user?.firstName} />
      <AvatarFallback {...props}>
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
