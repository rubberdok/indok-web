"use client";
import { useAlerts } from "@/app/components/Alerts";
import { getFragmentData, graphql } from "@/gql/app";
import { Role } from "@/gql/app/graphql";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type AddMemberDialogProps = {
  open: boolean;
  onClose: () => void;
  organizationId: string;
};
const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
});
const MemberFragment = graphql(`
  fragment AddMemberDialog_Member on Member {
    id
    user {
      id
      firstName
      lastName
    }
    organization {
      id
    }
    role
  }
`);

function AddMemberDialog({ open, onClose, organizationId }: AddMemberDialogProps) {
  const { notify } = useAlerts();
  const [addMember, { loading }] = useMutation(
    graphql(`
      mutation OrganizationsAdminMembersPage_AddMember($data: AddMemberInput!) {
        addMember(data: $data) {
          member {
            ...AddMemberDialog_Member
          }
        }
      }
    `),
    {
      onCompleted() {
        notify({ message: "Medlem lagt til", type: "success" });
        onClose();
      },
      onError(errors) {
        const error = errors.graphQLErrors[0];
        switch (error.extensions?.code) {
          case "NOT_FOUND": {
            return notify({
              message: "Kunne ikke legge til e-posten som medlem, sjekk at den stemmer.",
              type: "error",
            });
          }
          case "BAD_USER_INPUT": {
            return notify({ message: "Personen er allerede medlem av organisasjonen", type: "info" });
          }
          default: {
            return notify({ title: "Noe gikk galt", message: errors.message, type: "error" });
          }
        }
      },
      update(cache, { data }) {
        if (data?.addMember.member) {
          const member = getFragmentData(MemberFragment, data.addMember.member);
          cache.modify({
            id: cache.identify(member.organization),
            fields: {
              members(existingMembers = []) {
                const newMemberRef = cache.writeFragment({
                  data: member,
                  fragment: MemberFragment,
                });
                return [...existingMembers, newMemberRef];
              },
            },
          });
        }
      },
    }
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: Role.Member,
    },
  });

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <form
        onSubmit={handleSubmit((data) => {
          addMember({
            variables: {
              data: {
                organizationId,
                email: data.email,
                role: data.role,
              },
            },
          });
        })}
      >
        <DialogTitle>Legg til nytt medlem</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={1} pt={2}>
            <TextField
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message ?? " "}
              label="E-post"
              type="email"
            />
            <Controller
              control={control}
              name="role"
              render={({ field, fieldState: { error } }) => (
                <FormControl error={Boolean(error)}>
                  <InputLabel htmlFor="role">Rolle</InputLabel>
                  <Select notched label="Rolle" {...field} id="role" native>
                    <option value={Role.Member}>Medlem</option>
                    <option value={Role.Admin}>Administrator</option>
                  </Select>
                  <FormHelperText>{errors.role?.message ?? " "}</FormHelperText>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} onClick={() => onClose()}>
            Avbryt
          </LoadingButton>
          <LoadingButton loading={loading} type="submit">
            Legg til
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export { AddMemberDialog };
