import { Box, Flex, Heading, Text, Badge, Link, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import Countdown from './Countdown';
import { getDeadlineInfo, getSubjectsArray, getSubjectColor } from '../utils/parser';
import { Conference } from '../types/conference';

const MotionBox = motion.create(Box);

interface ConferenceCardProps {
  conference: Conference;
  onClick: () => void;
  index?: number;
}

export default function ConferenceCard({ conference, onClick, index = 0 }: ConferenceCardProps): JSX.Element {
  const allDeadlines = getDeadlineInfo(conference);

  // Lighter animation for mobile (faster, less "aggressive")
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const animationDelay = isMobile ? (index % 12) * 0.05 : (index % 12) * 0.08;
  const animationDuration = isMobile ? 0.4 : 0.6;

  return (
    <MotionBox
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px", amount: 0.1 }}
      transition={{
        duration: animationDuration,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="brand.200"
      boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
      p="6"
      cursor="pointer"
      whileHover={{
        boxShadow: '0 8px 24px rgba(46, 95, 169, 0.2)',
        y: -4,
        scale: 1.02,
        borderColor: 'var(--chakra-colors-brand-400)',
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
    >
      {/* Card Header */}
      <VStack align="stretch" gap="3" mb="3">
        <Flex justify="space-between" align="start" gap="3" wrap="wrap">
          <Heading as="h3" size="lg" color="gray.800" flex="1" minW="200px">
            {conference.title} {conference.year}
          </Heading>
          <Flex gap="2" wrap="wrap" justify="flex-end" align="center">
            {getSubjectsArray(conference.sub).map((subject, idx) => {
              const colors = getSubjectColor(subject);
              return (
                <Badge
                  key={idx}
                  px="3"
                  py="1"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="600"
                  bg={colors.bg}
                  color={colors.color}
                  border="1px"
                  borderColor={colors.border}
                  whiteSpace="nowrap"
                >
                  {subject}
                </Badge>
              );
            })}
          </Flex>
        </Flex>
        {conference.note && (
          <Badge
            px="2"
            py="1"
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
            textTransform="uppercase"
            bg="blue.100"
            color="blue.800"
            wordBreak="break-word"
            whiteSpace="normal"
            alignSelf="flex-start"
            maxW="fit-content"
          >
            {conference.note}
          </Badge>
        )}
      </VStack>

      {/* Subtitle */}
      <Text fontSize="sm" color="gray.600" mb="4" lineHeight="1.5">
        {conference.full_name}
      </Text>

      {/* Info Section */}
      <VStack align="stretch" gap="2" mb="4">
        <Flex fontSize="sm">
          <Text color="gray.600" fontWeight="500" minW="100px">
            📍 Location:
          </Text>
          <Text color="gray.800">{conference.place}</Text>
        </Flex>
        <Flex fontSize="sm">
          <Text color="gray.600" fontWeight="500" minW="100px">
            📅 Date:
          </Text>
          <Text color="gray.800">{conference.date}</Text>
        </Flex>
        {(conference.hindex ?? 0) > 0 && (
          <Flex fontSize="sm">
            <Text color="gray.600" fontWeight="500" minW="100px">
              📊 H-Index:
            </Text>
            <Text color="gray.800">{conference.hindex}</Text>
          </Flex>
        )}
      </VStack>

      {/* Deadlines */}
      {allDeadlines.length > 0 ? (
        <VStack
          align="stretch"
          gap="4"
          p="4"
          bg="gray.50"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          mb="4"
        >
          {allDeadlines.map((deadline, idx) => {
            const now = DateTime.now();
            const isExpired = deadline.localDatetime <= now;

            return (
              <VStack key={idx} align="stretch" gap="3">
                <VStack align="stretch" gap="1">
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="brand.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {deadline.label}
                  </Text>
                  <Flex fontSize="sm" gap="2">
                    <Text color="gray.600" fontWeight="500" minW="60px">
                      Original:
                    </Text>
                    <Text color="gray.800" fontFamily="mono" fontSize="xs">
                      {deadline.datetime.toFormat('MMM dd, yyyy HH:mm')} {conference.timezone}
                    </Text>
                  </Flex>
                  <Flex fontSize="sm" gap="2">
                    <Text color="gray.600" fontWeight="500" minW="60px">
                      Local:
                    </Text>
                    <Text color="gray.800" fontFamily="mono" fontSize="xs">
                      {deadline.localDatetime.toFormat('MMM dd, yyyy HH:mm')} {deadline.localDatetime.zoneName}
                    </Text>
                  </Flex>
                </VStack>

                {/* Countdown or Expired */}
                <Box
                  p="3"
                  bg={isExpired ? 'red.50' : 'blue.50'}
                  borderRadius="md"
                  border="1px"
                  borderColor={isExpired ? 'red.200' : 'blue.200'}
                >
                  {isExpired ? (
                    <Text fontSize="sm" color="red.600" fontWeight="600">
                      Expired
                    </Text>
                  ) : (
                    <Countdown deadline={deadline.localDatetime} label="Time remaining" />
                  )}
                </Box>
              </VStack>
            );
          })}
        </VStack>
      ) : (
        <Box
          p="3"
          textAlign="center"
          bg="gray.50"
          borderRadius="lg"
          border="1px"
          borderColor="gray.200"
          borderStyle="dashed"
          mb="4"
        >
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            No deadlines available
          </Text>
        </Box>
      )}

      {/* Links */}
      <Flex gap="3" wrap="wrap" pt="4" borderTop="1px" borderColor="gray.200">
        {conference.link && (
          <Link
            href={conference.link}
            target="_blank"
            rel="noopener noreferrer"
            px="4"
            py="2"
            bg="brand.500"
            color="white"
            borderRadius="md"
            fontSize="sm"
            fontWeight="500"
            transition="all 0.2s"
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Website
          </Link>
        )}
        {conference.paperslink && (
          <Link
            href={conference.paperslink}
            target="_blank"
            rel="noopener noreferrer"
            px="4"
            py="2"
            bg="brand.500"
            color="white"
            borderRadius="md"
            fontSize="sm"
            fontWeight="500"
            transition="all 0.2s"
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Papers
          </Link>
        )}
        {conference.pwclink && (
          <Link
            href={conference.pwclink}
            target="_blank"
            rel="noopener noreferrer"
            px="4"
            py="2"
            bg="brand.500"
            color="white"
            borderRadius="md"
            fontSize="sm"
            fontWeight="500"
            transition="all 0.2s"
            _hover={{
              bg: 'brand.600',
              transform: 'translateY(-1px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Papers w/ Code
          </Link>
        )}
      </Flex>
    </MotionBox>
  );
}
