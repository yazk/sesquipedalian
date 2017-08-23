var semver = require('semver');
var pjson = require('./package.json');

const version = pjson.engines.node;

if (!semver.satisfies(process.version, version))
{
  console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
  process.exit(1);
}
else
{
  console.log('Node verison passed!');
}