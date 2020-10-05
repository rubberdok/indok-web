import { CREATE_EVENT } from "../../../graphql/events/mutations";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const CreateEvent = () => {
    const deafultInput = {
        title: "",
        description: "",
        starttime: "",
    };

    const [inputData, setInputData] = useState(deafultInput);

    const [createEvent] = useMutation(CREATE_EVENT, {
        update: (cache, { data: { createEvent } }) => {
            cache.modify({
                fields: {
                    allEvents: (existingEvents) => {
                        const newEventRef = cache.writeFragment({
                            data: createEvent.event,
                            fragment: gql`
                                fragment NewEvent on Event {
                                    id
                                }
                            `,
                        });
                        return [...existingEvents, newEventRef];
                    },
                },
            });
        },
    });

    const { title, description, starttime } = inputData;
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createEvent({
                        variables: inputData,
                    });
                    setInputData(deafultInput);
                }}
            >
                <div>
                    <input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setInputData({ ...inputData, title: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setInputData({ ...inputData, description: e.currentTarget.value })}
                    />
                </div>
                <div>
                    <input
                        type="datetime-local"
                        placeholder="Start time"
                        value={starttime}
                        onChange={(e) => setInputData({ ...inputData, starttime: e.currentTarget.value })}
                    />
                </div>
                <button type="submit">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
