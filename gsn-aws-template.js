{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "vpce7c03982": {
      "Type": "AWS::EC2::VPC",
      "Properties": {
        "CidrBlock": "10.0.0.0/16",
        "InstanceTenancy": "default",
        "EnableDnsSupport": "true",
        "EnableDnsHostnames": "true",
        "Tags": [
          {
            "Key": "Name",
            "Value": "ecs-vpc-1"
          }
        ]
      }
    },
    "subnetb48492f2": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.2.0/24",
        "AvailabilityZone": "us-west-1c",
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ecs-pvt-sub-2"
          }
        ]
      }
    },
    "subnet608d5c05": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.1.0/24",
        "AvailabilityZone": "us-west-1a",
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "ecs-pvt-sub-1"
          }
        ]
      }
    },
    "subnet0f8a5b6a": {
      "Type": "AWS::EC2::Subnet",
      "Properties": {
        "CidrBlock": "10.0.0.0/24",
        "AvailabilityZone": "us-west-1a",
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "Tags": [
          {
            "Key": "Name",
            "Value": "Public subnet"
          }
        ]
      }
    },
    "igw5628c633": {
      "Type": "AWS::EC2::InternetGateway",
      "Properties": {
      }
    },
    "dopt653d2107": {
      "Type": "AWS::EC2::DHCPOptions",
      "Properties": {
        "DomainName": "us-west-1.compute.internal",
        "DomainNameServers": [
          "AmazonProvidedDNS"
        ]
      }
    },
    "acl3e916b5b": {
      "Type": "AWS::EC2::NetworkAcl",
      "Properties": {
        "VpcId": {
          "Ref": "vpce7c03982"
        }
      }
    },
    "rtb5fb0753a": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpce7c03982"
        }
      }
    },
    "rtb5cb07539": {
      "Type": "AWS::EC2::RouteTable",
      "Properties": {
        "VpcId": {
          "Ref": "vpce7c03982"
        }
      }
    },
    "eip5467578": {
      "Type": "AWS::EC2::EIP",
      "DependsOn": [
        "gw3"
      ],
      "Properties": {
        "Domain": "vpc",
        "InstanceId": {
          "Ref": "instancei99557a51"
        }
      }
    },
    "eipworker": {
      "Type": "AWS::EC2::EIP",
      "DependsOn": [
        "gw3"
      ],
      "Properties": {
        "Domain": "vpc",
        "InstanceId": {
          "Ref": "instanceanother"
        }
      }
    },
    "instancei99557a51": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "DisableApiTermination": "FALSE",
        "ImageId": "ami-076e6542",
        "InstanceType": "t2.micro",
        "KeyName": "n.california",
        "Monitoring": "false",
        "Volumes" : [
         { "VolumeId" : { "Ref" : "volumevola65f10a5" }, "Device" : "/dev/sdf" }
        ],         
        "Tags": [
          {
            "Key": "Name",
            "Value": "ecs-test-ec2-cloud"
          }
        ],
        "NetworkInterfaces": [
          {
            "DeleteOnTermination": "true",
            "Description": "Primary network interface",
            "DeviceIndex": 0,
            "SubnetId": {
              "Ref": "subnet0f8a5b6a"
            },
            "PrivateIpAddresses": [
              {
                "PrivateIpAddress": "10.0.0.177",
                "Primary": "true"
              }
            ],
            "GroupSet": [
              {
                "Ref": "sgWebServerSG"
              }
            ]
          }
        ]
      }
    },
    "instanceanother": {
      "Type": "AWS::EC2::Instance",
      "Properties": {
        "DisableApiTermination": "FALSE",
        "ImageId": "ami-076e6542",
        "InstanceType": "t2.micro",
        "KeyName": "n.california",
        "Monitoring": "false",
        "Tags": [
          {
            "Key": "Name",
            "Value": "ecs-test-ec2-cloud-worker"
          }
        ],
        "NetworkInterfaces": [
          {
            "DeleteOnTermination": "true",
            "Description": "Primary network interface",
            "DeviceIndex": 0,
            "SubnetId": {
              "Ref": "subnet0f8a5b6a"
            },
            "GroupSet": [
              {
                "Ref": "sgWebServerSG"
              }
            ]
          }
        ]
      }
    },
    "volumevola65f10a5": {
      "Type": "AWS::EC2::Volume",
      "Properties": {
        "AvailabilityZone": "us-west-1a",
        "Size": "1000",
        "VolumeType": "gp2"
      }
    },
    "rdswordpress": {
      "Type": "AWS::RDS::DBInstance",
      "Properties": {
        "AutoMinorVersionUpgrade": "true",
        "DBInstanceClass": "db.t2.micro",
        "Port": "3306",
        "AllocatedStorage": "5",
        "BackupRetentionPeriod": "7",
        "DBName": "MyDatabase",
        "Engine": "mysql",
        "EngineVersion": "5.6.19a",
        "LicenseModel": "general-public-license",
        "MasterUsername": "wpuser",
        "MasterUserPassword": "MyPassword",
        "PreferredBackupWindow": "07:10-07:40",
        "PreferredMaintenanceWindow": "fri:06:39-fri:07:09",
        "VPCSecurityGroups": [
          {
            "Ref": "sgWebServerSG"
          }
        ],
        "DBSubnetGroupName": {
          "Ref": "dbsubnetecsdbsubgrp1"
        },
        "Tags": [
          {
            "Key": "workload-type",
            "Value": "other"
          }
        ]
      }
    },
    "dbsubnetecsdbsubgrp1": {
      "Type": "AWS::RDS::DBSubnetGroup",
      "Properties": {
        "DBSubnetGroupDescription": "ecs-db-sub-grp-1",
        "SubnetIds": [
          {
            "Ref": "subnetb48492f2"
          },
          {
            "Ref": "subnet608d5c05"
          }
        ]
      }
    },
    "sgWebServerSG": {
      "Type": "AWS::EC2::SecurityGroup",
      "Properties": {
        "GroupDescription": "ecs-vpc-sec-grp-1",
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "SecurityGroupIngress": [
          {
            "IpProtocol": "udp",
            "FromPort": "111",
            "ToPort": "111",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "111",
            "ToPort": "111",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "443",
            "ToPort": "443",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "3306",
            "ToPort": "3306",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "3389",
            "ToPort": "3389",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "22",
            "ToPort": "22",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "udp",
            "FromPort": "2049",
            "ToPort": "2049",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "44182",
            "ToPort": "44182",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "80",
            "ToPort": "80",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "2049",
            "ToPort": "2049",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "udp",
            "FromPort": "32768",
            "ToPort": "32768",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "udp",
            "FromPort": "32770",
            "ToPort": "32800",
            "CidrIp": "0.0.0.0/0"
          },
          {
            "IpProtocol": "tcp",
            "FromPort": "54508",
            "ToPort": "54508",
            "CidrIp": "0.0.0.0/0"
          }
        ]
      }
    },
    "acl5": {
      "Type": "AWS::EC2::NetworkAclEntry",
      "Properties": {
        "CidrBlock": "0.0.0.0/0",
        "Egress": true,
        "Protocol": "-1",
        "RuleAction": "allow",
        "RuleNumber": "100",
        "NetworkAclId": {
          "Ref": "acl3e916b5b"
        }
      }
    },
    "acl6": {
      "Type": "AWS::EC2::NetworkAclEntry",
      "Properties": {
        "CidrBlock": "0.0.0.0/0",
        "Protocol": "-1",
        "RuleAction": "allow",
        "RuleNumber": "100",
        "NetworkAclId": {
          "Ref": "acl3e916b5b"
        }
      }
    },
    "subnetacl7": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "acl3e916b5b"
        },
        "SubnetId": {
          "Ref": "subnet0f8a5b6a"
        }
      }
    },
    "subnetacl8": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "acl3e916b5b"
        },
        "SubnetId": {
          "Ref": "subnetb48492f2"
        }
      }
    },
    "subnetacl9": {
      "Type": "AWS::EC2::SubnetNetworkAclAssociation",
      "Properties": {
        "NetworkAclId": {
          "Ref": "acl3e916b5b"
        },
        "SubnetId": {
          "Ref": "subnet608d5c05"
        }
      }
    },
    "gw3": {
      "Type": "AWS::EC2::VPCGatewayAttachment",
      "Properties": {
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "InternetGatewayId": {
          "Ref": "igw5628c633"
        }
      }
    },
    "subnetroute5": {
      "Type": "AWS::EC2::SubnetRouteTableAssociation",
      "Properties": {
        "RouteTableId": {
          "Ref": "rtb5fb0753a"
        },
        "SubnetId": {
          "Ref": "subnet0f8a5b6a"
        }
      }
    },
    "route3": {
      "Type": "AWS::EC2::Route",
      "Properties": {
        "DestinationCidrBlock": "0.0.0.0/0",
        "RouteTableId": {
          "Ref": "rtb5fb0753a"
        },
        "GatewayId": {
          "Ref": "igw5628c633"
        }
      },
      "DependsOn": "gw3"
    },
    "dchpassoc3": {
      "Type": "AWS::EC2::VPCDHCPOptionsAssociation",
      "Properties": {
        "VpcId": {
          "Ref": "vpce7c03982"
        },
        "DhcpOptionsId": {
          "Ref": "dopt653d2107"
        }
      }
    },
    "ingress1": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "udp",
        "FromPort": "111",
        "ToPort": "111",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress2": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "111",
        "ToPort": "111",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress3": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "443",
        "ToPort": "443",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress4": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "3306",
        "ToPort": "3306",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress5": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "3389",
        "ToPort": "3389",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress6": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "22",
        "ToPort": "22",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress7": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "udp",
        "FromPort": "2049",
        "ToPort": "2049",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress8": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "44182",
        "ToPort": "44182",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress9": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "80",
        "ToPort": "80",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress10": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "2049",
        "ToPort": "2049",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress11": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "udp",
        "FromPort": "32768",
        "ToPort": "32768",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress12": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "udp",
        "FromPort": "32770",
        "ToPort": "32800",
        "CidrIp": "0.0.0.0/0"
      }
    },
    "ingress13": {
      "Type": "AWS::EC2::SecurityGroupIngress",
      "Properties": {
        "GroupId": {
          "Ref": "sgWebServerSG"
        },
        "IpProtocol": "tcp",
        "FromPort": "54508",
        "ToPort": "54508",
        "CidrIp": "0.0.0.0/0"
      }
    }
  },
  "Description": "test4"
}