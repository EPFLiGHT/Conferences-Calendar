import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  Link,
  VStack,
} from '@chakra-ui/react';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from '@chakra-ui/react';
import { getDeadlineInfo } from '../utils/parser';
import { exportConference } from '../utils/ics';

export default function ConferenceModal({ conference, onClose }) {
  const deadlines = getDeadlineInfo(conference);

  const handleExport = () => {
    exportConference(conference);
  };

  return (
    <DialogRoot open={true} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <VStack align="start" gap="2">
            <Heading as="h2" size="xl">
              {conference.title} {conference.year}
            </Heading>
            <Text fontSize="md" color="gray.600">
              {conference.full_name}
            </Text>
          </VStack>
          <DialogCloseTrigger />
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap="6">
            {/* Conference Details */}
            <Box>
              <Heading as="h3" size="md" mb="4">
                Conference Details
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
                <VStack align="start" gap="2">
                  <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                    Location
                  </Text>
                  <Text fontSize="md" color="gray.800">{conference.place}</Text>
                </VStack>
                <VStack align="start" gap="2">
                  <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                    Date
                  </Text>
                  <Text fontSize="md" color="gray.800">{conference.date}</Text>
                </VStack>
                <VStack align="start" gap="2">
                  <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                    Subject
                  </Text>
                  <Badge
                    px="3"
                    py="1"
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="500"
                    bg="brand.50"
                    color="brand.500"
                    border="1px"
                    borderColor="brand.200"
                  >
                    {conference.sub}
                  </Badge>
                </VStack>
                {conference.hindex > 0 && (
                  <VStack align="start" gap="2">
                    <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      H-Index
                    </Text>
                    <Text fontSize="md" color="gray.800">{conference.hindex}</Text>
                  </VStack>
                )}
                {conference.note && (
                  <VStack align="start" gap="2">
                    <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                      Note
                    </Text>
                    <Badge
                      px="2"
                      py="0.5"
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="600"
                      textTransform="uppercase"
                      bg="blue.100"
                      color="blue.800"
                    >
                      {conference.note}
                    </Badge>
                  </VStack>
                )}
              </Grid>
            </Box>

            {/* Deadlines */}
            {deadlines.length > 0 && (
              <Box>
                <Heading as="h3" size="md" mb="4">
                  Deadlines
                </Heading>
                <VStack align="stretch" gap="4">
                  {deadlines.map((deadline, idx) => (
                    <Box
                      key={idx}
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      overflow="hidden"
                    >
                      <Box
                        p="3"
                        bg="blue.50"
                        borderBottom="1px"
                        borderColor="blue.200"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="brand.500"
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {deadline.label}
                        </Text>
                      </Box>
                      <VStack align="stretch" gap="4" p="4">
                        <VStack align="start" gap="1">
                          <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                            Original Time:
                          </Text>
                          <Text fontSize="sm" color="gray.800" fontFamily="mono" lineHeight="1.6">
                            {deadline.datetime.toFormat('EEEE, MMMM dd, yyyy')}
                            <br />
                            {deadline.datetime.toFormat('HH:mm')} {conference.timezone}
                          </Text>
                        </VStack>
                        <VStack align="start" gap="1">
                          <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                            Your Local Time:
                          </Text>
                          <Text fontSize="sm" color="gray.800" fontFamily="mono" lineHeight="1.6">
                            {deadline.localDatetime.toFormat('EEEE, MMMM dd, yyyy')}
                            <br />
                            {deadline.localDatetime.toFormat('HH:mm')} {deadline.localDatetime.zoneName}
                          </Text>
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Quick Links */}
            <Box>
              <Heading as="h3" size="md" mb="4">
                Quick Links
              </Heading>
              <Flex gap="3" wrap="wrap">
                {conference.link && (
                  <Link
                    href={conference.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                      _active={{ transform: 'scale(0.97)' }}
                    >
                      Conference Website
                    </Button>
                  </Link>
                )}
                {conference.paperslink && (
                  <Link
                    href={conference.paperslink}
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      variant="outline"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                      _active={{ transform: 'scale(0.97)' }}
                    >
                      Accepted Papers
                    </Button>
                  </Link>
                )}
                {conference.pwclink && (
                  <Link
                    href={conference.pwclink}
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                  >
                    <Button
                      variant="outline"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                      _active={{ transform: 'scale(0.97)' }}
                    >
                      Papers with Code
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleExport}
                  variant="outline"
                  transition="all 0.2s ease-in-out"
                  position="relative"
                  zIndex="1"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                  _active={{ transform: 'scale(0.97)' }}
                >
                  Export to Calendar
                </Button>
              </Flex>
            </Box>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
