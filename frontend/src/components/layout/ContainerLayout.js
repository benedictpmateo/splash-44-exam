import { Box } from "@chakra-ui/react";

const ContainerLayout = ({ children, ...props }) => {
  return (
    <Box mx="auto" maxW="7xl" px={{ base: "4", md: "8", lg: "10" }} {...props}>
      {children}
    </Box>
  );
};

export default ContainerLayout;
