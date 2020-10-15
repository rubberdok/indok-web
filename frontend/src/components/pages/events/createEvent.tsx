import { CREATE_EVENT } from "@graphql/events/mutations";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Event } from "@interfaces/events";

const CreateEvent = () => {
    const defaultInput = {
        title: "",
        description: "",
        starttime: "",
    };

    const [inputData, setInputData] = useState(defaultInput);

    const [createEvent] = useMutation<{ createEvent: { event: Event } }>(CREATE_EVENT, {
        update: (cache, { data }) => {
            data &&
                cache.modify({
                    fields: {
                        allEvents: (existingEvents) => {
                            const newEventRef = cache.writeFragment<Event>({
                                data: data.createEvent.event,
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
                    setInputData(defaultInput);
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
