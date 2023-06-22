import { useMutation, useQuery } from "react-query";
import TagEditor from "./TagEditor";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import { getAllRecipes, getAllTags } from "@/client/queries";
import HomePageEditor from "./HomePageEditor";
import UsersEditor from "./UsersEditors";
import { Container } from "react-bootstrap";
import RecipesDashboard from "./RecipesDashboard";

export default function AdminPage() {
  const { data: tags } = useQuery(["tags"], getAllTags);
  return (
    <Container>
      <h1>Admin Panel</h1>
      <Tabs defaultActiveKey="home" className="mb-3">
      <Tab eventKey="home" title="Home">
        <HomePageEditor />
      </Tab>
      <Tab eventKey="users" title="Users">
        <UsersEditor />
      </Tab>
      <Tab eventKey="recipes" title="Recipes">
        <RecipesDashboard />
      </Tab>
      <Tab eventKey="profile" title="Comments"></Tab>
      <Tab eventKey="contact" title="Tags">
        <TagEditor tags={tags} />
      </Tab>
    </Tabs>
    </Container>
    
  );
}




