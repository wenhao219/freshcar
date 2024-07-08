import moment from "moment"

const formatDate = (data: any) => {
  return moment(data).format("DD-MM-YYYY")
}

export { formatDate }
