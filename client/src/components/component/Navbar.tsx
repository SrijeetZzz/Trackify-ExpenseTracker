// // import React from "react";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
// //   NavigationMenuIndicator,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// //   NavigationMenuViewport,
// } from "@/components/ui/navigation-menu"

// const Navbar = () => {
//   return (
//     <div>
//       <NavigationMenu>
//         <NavigationMenuList>
//           <NavigationMenuItem>
//             <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
//             <NavigationMenuContent>
//               <NavigationMenuLink>Link</NavigationMenuLink>
//             </NavigationMenuContent>
//           </NavigationMenuItem>
//         </NavigationMenuList>
//       </NavigationMenu>
//     </div>
//   );
// };

// export default Navbar;


import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
  return (
    <div className="w-full shadow-md bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Left Section: Logo + Company Name */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">CompanyName</span>
        </div>

        {/* Middle Section: Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
              {/* <NavigationMenuContent>
                <NavigationMenuLink className="p-2">Link</NavigationMenuLink>
              </NavigationMenuContent> */}
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
              {/* <NavigationMenuContent>
                <NavigationMenuLink className="p-2">Another Link</NavigationMenuLink>
              </NavigationMenuContent> */}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Section: Search + User Name + Avatar */}
        <div className="flex items-center gap-4">
          <Input type="text" placeholder="Search..." className="w-48" />
          <span className="font-medium">John Doe</span>
          <Avatar>
            <AvatarImage src="/profile.jpg" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}

export default Navbar
