import { Box, Flex, Heading, Text, Badge, Link, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Countdown from './Countdown';
import { getNextDeadline, getDeadlineInfo } from '../utils/parser';
import { Conference } from '../types/conference';

interface ConferenceCardProps {
  conference: Conference;
  onClick: () => void;
}

export default function ConferenceCard({ conference, onClick }: ConferenceCardProps): JSX.Element {
  const nextDeadline = getNextDeadline(conference);
  const allDeadlines = getDeadlineInfo(conference);

  return (
    <Box
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="brand.200"
      boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
      p="6"
      cursor="pointer"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        boxShadow: '0 4px 12px rgba(46, 95, 169, 0.15)',
        transform: 'translateY(-2px)',
        borderColor: 'brand.300',
      }}
      _active={{
        transform: 'translateY(0px)',
      }}
      onClick={onClick}
    >
      {/* Card Header */}
      <Flex justify="space-between" align="start" gap="4" mb="3">
        <VStack align="start" gap="2" flex="1">
          <Heading as="h3" size="lg" color="gray.800">
            {conference.title} {conference.year}
          </Heading>
          {conference.note && (
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
          )}
        </VStack>
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
      </Flex>

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
    </Box>
  );
}
