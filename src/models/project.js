class Project {
  constructor(
    id,
    jobcode,
    projectname,
    lcduedate,
    inspectiondate,
    valuer_n,
    lat,
    lng
  ) {
    this.id = id; //fix name to phpMyAdmin
    this.jobcode = jobcode;
    this.projectname = projectname;
    this.lcduedate = lcduedate;
    this.inspectiondate = inspectiondate;
    this.valuer_n = valuer_n;
    this.lat = lat;
    this.lng = lng;
  }
}

export default Project;
