import Head from "next/head";

const { Box } = require("@chakra-ui/react");

const PageLayout = ({ title = "", children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box as="main" mx="auto" pb={{ base: "6", md: "8", lg: "12" }}>
        {children}
      </Box>
    </>
  );
};

export default PageLayout;
