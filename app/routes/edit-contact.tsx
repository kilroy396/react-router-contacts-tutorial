import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/edit-contact";

import { getContact, updateContact } from "../data";

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData();
  // const firstName = formData.get("first");  // This is how you would extract individual fields
  // const lastName = formData.get("last");
  const updates = Object.fromEntries(formData); // This takes all the form data and converts it to a plain object
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact }  = loaderData;
  const  navigate  = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">Cancel</button>
        
      </p>
    </Form>
  );
}
