import { Transform } from 'stream';
import { ConsumerGroupStream, ConsumerGroupStreamOptions } from 'kafka-node';

const {
  KAFKA_HOST,
  CONSUMER_GROUP_ID,
  KAFKA_TOPIC
} = process.env;

const consumerOptions: ConsumerGroupStreamOptions = {
  kafkaHost: KAFKA_HOST,
  groupId: CONSUMER_GROUP_ID,
  autoCommit: false,
  protocol: ['roundrobin'],
  fromOffset: 'latest',
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
  transform(message) {
    console.log(`Received message ${message.value} transforming input`);
  }
});

consumerGroup.pipe(messageTransform);