import { NextPage } from "next";
import Layout from "@components/Layout";
import { Container } from "@material-ui/core";
import AnswerForm from "@components/forms/AnswerForm";
import { useQuery } from "@apollo/client";
import { Form } from "@interfaces/forms";
import { FORM_RESPONSES } from "@graphql/forms/queries";
import { useRouter } from "next/router";

const FormPage: NextPage = () => {
	const { formId } = useRouter().query
	const { loading, error, data } = useQuery<{ form: Form }>(FORM_RESPONSES, {
		variables: {
			formId: (formId && formId[0] as string)
		}
	});

	if (loading) return <p>Laster...</p>;
	if (error) return <p> Noe gikk galt</p>;

	return (
		<Layout>
			{data && 
				<Container>
					<AnswerForm form={data.form} />
				</Container>
			}
		</Layout>
	)
}

export default FormPage;