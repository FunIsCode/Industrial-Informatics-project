%if not(robotics.ros.internal.Global.isNodeActive)
    rosinit('169.254.226.217'); %Write your RaspberryPi IP
%end
pub=rospublisher('/request'); %Publish in number topic
msg=rosmessage('std_msgs/String');
msg.Data='L -72,44,0 0,0,0 0,0,0 20'; %For instance Tell the robot to write a 5
send(pub,msg);

%msg_joint_1 = ' 0,';
%msg_joint_2 = '0,';
msg_joint_3 = '0';
msg_front = 'L';
msg_front = pad(msg_front, 'right');
msg_back = ' 0,0,0 0,0,0 20';

%msg_combined = strcat(msg_front, msg_joint_1, msg_joint_2, msg_joint_3, msg_back);


% Scara robot links
L(1)= Link([0 0 0 0],'modified');
L(2)= Link([0 0 .15 0],'modified');
L(3)= Link([0 0 .12 0],'modified');
L(4)= Link([0 0 0 0 1],'modified');

% Prismatic joints require the limit properties
L(4).qlim = [-0.3 0.0];

% Definition of the serial manipulator
scara = SerialLink(L,'name','SCARA');

pen_location = transl(.15,-.2,0.1);
scara.plotopt = {'workspace' [-1.5,1.5,-1.5,1.5,-0.5,1]};

% Inverse kinematics to get to the target (pen location)
ikine_pen = scara.ikine(pen_location, [pi/4,-pi/4,-pi/4,-0.03], 'mask', [1,1,1,0,0,1]);
ikine_pen = ikine_pen*(180/pi)
x = num2str(ikine_pen(1));
y = num2str(ikine_pen(2));

scara.plot(ikine_pen);

msg_joint_1 = strcat({' '}, x, ',')
msg_joint_2 = strcat(y, ',')
msg_combined = char(strcat(msg_front, msg_joint_1, msg_joint_2, msg_joint_3, msg_back));


