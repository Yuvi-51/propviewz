import { setSelectedKeys } from "@/store/slices/selectedKeysSlice";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Filter, SearchIcon } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SecondStep.scss";
import { columns } from "./data";

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

export default function SecondStepTable({
  projectData,
  selectedProjectData,
  setFilter,
}) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedData, setSelectedData] = React.useState([]);
  const dispatch = useDispatch();
  const selectedKeys = useSelector((state) => state.selectedKeys.value);
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const users = projectData && projectData?.project_list;
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);
  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm text-base capitalize">
              {user?.name} , {user?.detailed_area} <br /> {user?.all_config}
            </p>
          </div>
        );

      case "status":
        return (
          <div className="flex flex-col ">
            <p className="text-bold text-sm text-base capitalize ">
              {user?.each_configuration_count}
            </p>
          </div>
        );

        return cellValue;
    }
  }, []);
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, hasSearchFilter]);
  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      // setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  React.useEffect(() => {
    selectedProjectData(selectedData);
  }, [selectedData, selectedProjectData]);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const onFilterClick = () => {
    setFilter(true);
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-5 items-center ">
          <div className="mobile_filter">
            <Filter onClick={() => setFilter(true)} />
          </div>
          <Input
            isClearable
            className="w-full sm:max-w-[100%]"
            placeholder="Search Project by name..."
            startContent={
              <SearchIcon color="grey" style={{ paddingRight: "5px" }} />
            }
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        bottomContent={bottomContent}
        topContent={topContent}
        defaultSelectedKeys={Array.from(selectedKeys)}
        selectionMode="multiple"
        topContentPlacement="outside"
        onSelectionChange={(newSelectedKeys) => {
          dispatch(setSelectedKeys(Array.from(newSelectedKeys)));
          const newData = filteredItems.filter(
            (item) => newSelectedKeys.has(String(item.id)) // Convert item.id to a string
          );
          setSelectedData(newData);
        }}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No Projects found"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
