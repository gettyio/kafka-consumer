import { Transform } from 'stream';
import { ConsumerGroupStream, ConsumerGroupStreamOptions } from 'kafka-node';

enum FromOffset {
  EARLIEST = 'earliest',
  LATEST = 'latest'
};

const {
  KAFKA_HOST,
  CONSUMER_GROUP_ID,
  KAFKA_TOPIC,
  FROM_OFFSET
} = process.env;

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST,
  groupId: CONSUMER_GROUP_ID,
  autoCommit: false,
  protocol: ['roundrobin'],
  fromOffset: FROM_OFFSET as FromOffset,
  autoCommitIntervalMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  fetchMaxWaitMs: 100,
  encoding: 'utf8',
  fetchMinBytes: 1
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, KAFKA_TOPIC);

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform(message, encoding, done) {
    console.log(`Received message ${message.value} transforming input`);
    return done();
  }
});

consumerGroup.pipe(messageTransform).on('error', (error) => { console.error(error) });