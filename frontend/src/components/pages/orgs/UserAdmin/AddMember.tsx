import { useMutation, gql, useQuery } from "@apollo/client";
import { Organization } from "@interfaces/organizations";
import { Dialog, DialogTitle, Typography, IconButton, DialogContent, FormControl, makeStyles, Button, TextField, FormGroup, FormControlLabel, FormLabel, Checkbox } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  table: {
    minWidth: 800,
  },
}));

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  organizationId: number;
};

const AddMember: React.VFC<Props> = ({ open, setOpen, organizationId }) => {
  const classes = useStyles();

  const [memberId, setMemberId] = useState<string | undefined>();
  const [selectedGroupIds, selectGroupIds] = useState<string[]>([]);

  const [addMember] = useMutation<{ assignMembership: { ok: boolean } }>(gql`
    mutation assignMembership($input: MembershipInput!) {
      assignMembership(membershipData: $input) {
        ok
      }
    }
  `);

  const { data, loading, error } = useQuery<{
    organization: {
      permissionGroups: {
        name: string;
        description: string;
        uuid: string;
      }[]
    }
  }>(
    gql`
      query organization($id: ID) {
        organization(id: $id) {
          permissionGroups {
            name
            description
            uuid
          }
        }
      }
    `,
    { variables: { id: organizationId } }
  );

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <Dialog maxWidth="xs" fullWidth={true} onClose={() => setOpen(!open)} aria-labelledby="dialogTitle" open={open}>
      <DialogTitle disableTypography>
        <Typography gutterBottom variant="h4" id="dialogTitle">
          Legg til medlem
        </Typography>
        <IconButton className={classes.closeButton} aria-label="close" onClick={() => setOpen(!open)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField onChange={(event) => setMemberId(event.target.value)} fullWidth={true} variant="filled" />
        <br />
        <br />
        {data &&
          <FormControl component="fieldset">
            <FormLabel component="legend"></FormLabel>
            <FormGroup>
              {(data.organization?.permissionGroups ?? []).map((permissionGroup) => (
                <FormControlLabel
                  label={permissionGroup.name}
                  control={
                    <Checkbox
                      checked={selectedGroupIds.includes(permissionGroup.uuid)}
                      name={permissionGroup.uuid}
                      onChange={() => {
                        if (selectedGroupIds.includes(permissionGroup.uuid)) {
                          selectGroupIds(selectedGroupIds.filter((id) => id !== permissionGroup.uuid))
                        } else {
                          selectGroupIds([...selectedGroupIds, permissionGroup.uuid])
                        }
                      }}
                    />
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        }
        <br />
        <br />
        <Button
          onClick={() => addMember({
            variables: {
              input: {
                id: memberId,
                groupIds: selectedGroupIds,
                organizationId: organization.id,
              }
            }
          })}
          disabled={!Boolean(memberId)}
          variant="contained"
          color="primary"
        >Legg til</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
