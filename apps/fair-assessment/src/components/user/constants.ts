export const tempRoles = [
  { label: "Depositor", value: "depositor" },
  { label: "Curator", value: "curator" },
  { label: "Manager", value: "manager" },
];

export const tabs = [{
  label: "My objects",
  value: ["depositor", "manager", "curator"],
  id: 'objects',
}, {
  label: "My repositories",
  value: ["manager", "curator"],
  id: 'repositories',
}, {
  label: "My institutions",
  value: ["manager"],
  id: 'institutions',
}];

export const fixedOptions = [tempRoles[0]];