#!/bin/bash

# Footer.tsx
cat > src/components/Footer.tsx << 'COMPONENT_EOF'
import { Box, Container, Flex, Text, Link } from '@chakra-ui/react';

export default function Footer(): JSX.Element {
  return (
    <Box
      as="footer"
      mt="auto"
      py="8"
      bg="white"
      borderTop="1px"
      borderColor="brand.200"
    >
      <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
        <Flex
          direction="column"
          align="center"
          gap="2"
        >
          <Text fontSize="sm" color="gray.600">
            Made with ❤️ by{' '}
            <Link
              href="https://github.com/AZOGOAT"
              target="_blank"
              rel="noopener noreferrer"
              color="brand.500"
              fontWeight="500"
              _hover={{ textDecoration: 'underline' }}
            >
              AZO from the LiGHT Lab
            </Link>
          </Text>
          <Text fontSize="sm" color="gray.600">
            Contribute on{' '}
            <Link
              href="https://github.com/EPFLiGHT/Conferences-Calendar"
              target="_blank"
              rel="noopener noreferrer"
              color="brand.500"
              fontWeight="500"
              _hover={{ textDecoration: 'underline' }}
            >
              GitHub
            </Link>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
COMPONENT_EOF

echo "Fixed Footer.tsx"
