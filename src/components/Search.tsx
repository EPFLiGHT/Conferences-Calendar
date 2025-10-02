import { Box, Input } from '@chakra-ui/react';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Search({ value, onChange }: SearchProps): JSX.Element {
  return (
    <Box mb="8">
      <Input
        type="search"
        placeholder="Search conferences by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="lg"
        fontSize="md"
        bg="white"
        borderColor="brand.200"
        borderRadius="xl"
        boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
        _focus={{
          borderColor: 'brand.500',
          boxShadow: '0 0 0 3px rgba(46, 95, 169, 0.1)',
        }}
        _hover={{
          borderColor: 'brand.300',
        }}
      />
    </Box>
  );
}
