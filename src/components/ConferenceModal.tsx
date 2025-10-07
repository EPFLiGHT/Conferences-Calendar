import { useState, useEffect } from 'react';
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
  Portal,
} from '@chakra-ui/react';
import SubjectBadge from './SubjectBadge';
import { getDeadlineInfo, getSubjectsArray } from '../utils/parser';
import { exportConference } from '../utils/ics';
import { Conference } from '../types/conference';

interface ConferenceModalProps {
  conference: Conference;
  onClose: () => void;
}

export default function ConferenceModal({ conference, onClose }: ConferenceModalProps): JSX.Element | null {
  const [isOpen, setIsOpen] = useState(true);
  const deadlines = getDeadlineInfo(conference);

  const handleExport = () => {
    exportConference(conference);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex="modal"
        p="4"
        onClick={handleBackdropClick}
      >
        <Box
          bg="white"
          borderRadius="xl"
          maxW="800px"
          w="full"
          maxH="90vh"
          overflowY="auto"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          position="relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box
            position="sticky"
            top="0"
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            p="6"
            zIndex="10"
            borderTopRadius="xl"
          >
            <Button
              position="absolute"
              top="4"
              right="4"
              variant="ghost"
              size="sm"
              fontSize="xl"
              color="gray.600"
              transition="all 0.2s ease-in-out"
              _hover={{ bg: 'gray.100', color: 'gray.800' }}
              _active={{ transform: 'scale(0.95)' }}
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </Button>
            <VStack align="start" gap="2" pr="12">
              <Heading as="h2" size="xl" color="gray.800">
                {conference.title} {conference.year}
              </Heading>
              <Text fontSize="md" color="gray.600">
                {conference.full_name}
              </Text>
            </VStack>
          </Box>

          {/* Body */}
          <Box p="6">
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
                    Subject{getSubjectsArray(conference.sub).length > 1 ? 's' : ''}
                  </Text>
                  <Flex gap="2" wrap="wrap">
                    {getSubjectsArray(conference.sub).map((subject, idx) => (
                      <SubjectBadge key={idx} subject={subject} />
                    ))}
                  </Flex>
                </VStack>
                {(conference.hindex ?? 0) > 0 && (
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
                      wordBreak="break-word"
                      whiteSpace="normal"
                      maxW="100%"
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
              <Heading as="h3" size="md" mb="4" color="gray.800">
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
                      bg="brand.500"
                      color="white"
                      size="md"
                      px="6"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{
                        bg: 'brand.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(46, 95, 169, 0.4)'
                      }}
                      _active={{ transform: 'scale(0.98)' }}
                    >
                      🌐 Conference Website
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
                      bg="gray.100"
                      color="gray.700"
                      border="1px"
                      borderColor="gray.300"
                      size="md"
                      px="6"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{
                        bg: 'white',
                        borderColor: 'brand.400',
                        color: 'brand.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(46, 95, 169, 0.15)'
                      }}
                      _active={{ transform: 'scale(0.98)' }}
                    >
                      📄 Accepted Papers
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
                      bg="gray.100"
                      color="gray.700"
                      border="1px"
                      borderColor="gray.300"
                      size="md"
                      px="6"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{
                        bg: 'white',
                        borderColor: 'brand.400',
                        color: 'brand.600',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 2px 8px rgba(46, 95, 169, 0.15)'
                      }}
                      _active={{ transform: 'scale(0.98)' }}
                    >
                      💻 Papers with Code
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleExport}
                  bg="gray.100"
                  color="gray.700"
                  border="1px"
                  borderColor="gray.300"
                  size="md"
                  px="6"
                  transition="all 0.2s ease-in-out"
                  position="relative"
                  zIndex="1"
                  _hover={{
                    bg: 'white',
                    borderColor: 'brand.400',
                    color: 'brand.600',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(46, 95, 169, 0.15)'
                  }}
                  _active={{ transform: 'scale(0.98)' }}
                >
                  📅 Export to Calendar
                </Button>
              </Flex>
            </Box>
          </VStack>
        </Box>
      </Box>
    </Box>
    </Portal>
  );
}
