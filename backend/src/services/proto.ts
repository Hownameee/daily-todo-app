import { Message, toBinary } from "@bufbuild/protobuf";
import { GenMessage } from "@bufbuild/protobuf/codegenv2";

export default function toProto<T extends Message<string>>(schema: GenMessage<T>, message: T) {
	const data = toBinary(schema, message);
	return data;
}
